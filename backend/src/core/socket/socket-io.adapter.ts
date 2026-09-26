import { IoAdapter } from '@nestjs/platform-socket.io';
import { DefaultEventsMap, ExtendedError, Server, ServerOptions, Socket } from 'socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { ForbiddenError, UnauthorizedError } from '../../shared/errors/app.error.js';
import { AuthSessionService } from '../../shared/modules/auth-session/auth-session.service.js';
import { accountActive } from '@project/shared';
import { ServerToClientEvents } from '@project/shared';
import { SocketSessionService } from './socket-session.service.js';
import { IRoomProvider, ROOM_PROVIDER } from './room-provider.interface.js';
import { AppConfigService } from '../config/config.service.js';
import { MikroORM, RequestContext } from '@mikro-orm/postgresql';
import { AppSocket, SocketData } from '../../shared/types/socket.js';

export class SocketIoAdapter extends IoAdapter {
  private readonly authSessionService: AuthSessionService;
  private readonly socketSession: SocketSessionService;
  private readonly roomProvider: IRoomProvider;
  private readonly config: AppConfigService;
  private readonly orm: MikroORM;

  private async rejoinRooms(socket: AppSocket) {
    const userId = socket.data.user!.id;

    const rooms = await this.roomProvider.getRoomsForUser(userId);
    if (rooms.length > 0) socket.join(rooms);
  }

  constructor(private readonly app: INestApplicationContext) {
    super(app);
    this.config = this.app.get(AppConfigService);
    this.authSessionService = this.app.get(AuthSessionService);
    this.socketSession = this.app.get(SocketSessionService);
    this.roomProvider = this.app.get(ROOM_PROVIDER);
    this.orm = this.app.get(MikroORM);
  }
  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, {
      ...(options ?? {}),
      cors: { origin: this.config.allowedOrigins, credentials: true },
    } as ServerOptions) as Server<
      DefaultEventsMap,
      ServerToClientEvents,
      DefaultEventsMap,
      SocketData
    >;
    //auth guard
    server.use(async (socket, next: (err?: ExtendedError) => void) => {
      const token =
        (socket.handshake.auth.token as string | undefined) ??
        socket.handshake.headers.authorization;

      const { success, authUser, tokenPayload } =
        await this.authSessionService.validateSession(token);

      if (!success) {
        const error = new UnauthorizedError();
        const socketError = new Error(error.message) as ExtendedError;
        socketError.data = { errorCode: error.code, errorMessage: error.message };
        return next(socketError);
      }

      socket.data.user = authUser;

      if (
        !accountActive({
          emailConfirmed: tokenPayload.emailConfirmed,
          status: authUser.status,
        })
      ) {
        const error = new ForbiddenError('Account is inactive');
        const socketError = new Error(error.message) as ExtendedError;
        socketError.data = { errorCode: error.code, errorMessage: error.message };
        return next(error);
      }

      next();
    });

    server.on('connection', async (socket) => {
      const userId = socket.data.user!.id;
      await this.socketSession.setUserSocket(userId, socket.id);

      await RequestContext.create(this.orm.em, async () => {
        await this.rejoinRooms(socket);
      });

      socket.on('disconnect', async () => {
        await this.socketSession.deleteUserSocket(userId);
      });
    });

    return server;
  }
}
