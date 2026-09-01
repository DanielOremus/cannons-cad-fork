import { IoAdapter } from '@nestjs/platform-socket.io';
import { DefaultEventsMap, ExtendedError, Server, ServerOptions } from 'socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { ForbiddenError, UnauthorizedError } from '../../shared/errors/app.error.js';
import { AuthUser } from '../../shared/types/user.js';
import { AuthSessionService } from '../../shared/modules/auth-session/auth-session.service.js';
import { accountActive } from '@project/shared';

type SocketData = {
  user?: AuthUser;
};

export class SocketIoAdapter extends IoAdapter {
  private readonly authSessionService: AuthSessionService;
  constructor(private readonly app: INestApplicationContext) {
    super(app);
    this.authSessionService = this.app.get(AuthSessionService);
  }
  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options) as Server<
      DefaultEventsMap,
      DefaultEventsMap,
      DefaultEventsMap,
      SocketData
    >;
    //auth guard
    server.use(async (socket, next: (err?: ExtendedError) => void) => {
      const token =
        (socket.handshake.auth.token as string | undefined) ??
        socket.handshake.headers.authorization;
      const socketError = new Error() as ExtendedError;
      const {
        success,
        authUser,
        tokenPayload: payload,
      } = await this.authSessionService.validateSession(token);
      if (!success) {
        const error = new UnauthorizedError();
        socketError.message = error.message;
        socketError.data = { errorCode: error.code, errorMessage: error.message };
        return next(socketError);
      }

      socket.data.user = authUser;

      if (
        !accountActive({
          emailConfirmed: payload.emailConfirmed,
          status: payload.userStatus,
        })
      ) {
        const error = new ForbiddenError('Account is inactive');
        socketError.message = error.message;
        socketError.data = { errorCode: error.code, errorMessage: error.message };
        return next(error);
      }

      next();
    });

    server.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
    });

    return server;
  }
}
