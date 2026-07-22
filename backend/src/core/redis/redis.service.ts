import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { createClient, type RedisClientType } from 'redis';
import { RedisRTokenData, TokenPayloads } from '../../shared/types/token';
import { AppConfigService } from '../config/config.service';
import { Permission } from '@project/shared';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: RedisClientType;
  private readonly logger = new Logger('AppCore');
  constructor(private readonly config: AppConfigService) {
    this.client = createClient({
      username: config.redis.user,
      password: config.redis.password,
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
    });
  }
  private refreshKey(jti: string) {
    return `tokens:refresh:${jti}`;
  }
  private familyKey(id: string) {
    return `family:${id}`;
  }
  private userFamiliesKey(userId: string) {
    return `user:${userId}:families`;
  }
  private userPermissionsKey(userId: string) {
    return `user:${userId}:permissions`;
  }

  //Permissions caching

  async cacheUserPermissions(userId: string, permissions: Permission[]) {
    await this.client.setEx(
      this.userPermissionsKey(userId),
      this.config.jwt.access.ttl,
      JSON.stringify(permissions),
    );
  }

  async getUserPermissions(userId: string) {
    const value = await this.client.get(this.userPermissionsKey(userId));
    if (!value) return [];
    return JSON.parse(value) as Permission[];
  }

  //Token operations

  async storeRToken(data: TokenPayloads['refresh']) {
    const { jti, familyId, userId } = data;
    const refreshTtl = this.config.jwt.refresh.ttl;
    //Creating token
    const createToken = this.client.setEx(
      this.refreshKey(data.jti),
      refreshTtl,
      JSON.stringify({ jti, userId, familyId, used: false }),
    );
    //Creating family
    const createFamily = this.client.setEx(
      this.familyKey(familyId),
      refreshTtl,
      jti,
    );
    //Attaching family to user
    const attachFamily = this.client.zAdd(this.userFamiliesKey(userId), {
      score: Date.now() + refreshTtl * 1000,
      value: familyId,
    });
    await Promise.all([createToken, createFamily, attachFamily]);
  }
  async getRToken(jti: string) {
    const value = await this.client.get(this.refreshKey(jti));
    return !value ? null : (JSON.parse(value) as RedisRTokenData);
  }
  async familyExists(familyId: string) {
    return await this.client.exists(this.familyKey(familyId));
  }
  async revokeRToken(jti: string) {
    const tokenData = await this.getRToken(jti);
    if (tokenData) {
      tokenData.used = true;
      await this.client.set(this.refreshKey(jti), JSON.stringify(tokenData), {
        expiration: 'KEEPTTL',
      });
    }
  }
  async revokeFamily(userId: string, familyId: string) {
    //Getting jti and deleting family
    const deleteFamily = this.client.getDel(this.familyKey(familyId));
    //Detaching family from user
    const detachFamily = this.client.zRem(
      this.userFamiliesKey(userId),
      familyId,
    );
    const [jti] = await Promise.all([
      deleteFamily,
      detachFamily,
      this.detachExpiredFamilies(userId),
    ]);
    //Deleting token
    if (jti) await this.client.unlink(this.refreshKey(jti));
  }
  async revokeUserFamilies(userId: string) {
    //Getting user active families
    const getFamilyIds = this.client.zRangeByScore(
      this.userFamiliesKey(userId),
      Date.now(),
      Infinity,
    );
    const [activeFamilyIds] = await Promise.all([
      getFamilyIds,
      this.detachExpiredFamilies(userId),
    ]);
    //
    //Deleting active families and get their tokens' jti
    const deleteJtis = await Promise.all(
      activeFamilyIds.map((id) => this.client.getDel(this.familyKey(id))),
    );
    const deleteTokensKeys = deleteJtis.reduce<string[]>((acc, jti) => {
      if (jti) acc.push(jti);
      return acc;
    }, []);
    //Deleting active refresh token
    const deleteTokens = this.client.unlink(deleteTokensKeys);
    //Deleting user families set
    const deleteFamilies = this.client.unlink(this.userFamiliesKey(userId));

    await Promise.all([deleteTokens, deleteFamilies]);
  }

  private async detachExpiredFamilies(userId: string) {
    await this.client.zRemRangeByScore(
      this.userFamiliesKey(userId),
      -Infinity,
      Date.now(),
    );
  }
  async onModuleInit() {
    try {
      await this.client.connect();
      this.logger.log('Redis connected successfully');
    } catch (error) {
      this.logger.error('Redis connection failed: ' + error);
    }
  }
  onModuleDestroy() {
    this.client.destroy();
  }
}
