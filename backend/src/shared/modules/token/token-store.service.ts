import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../core/redis/redis.service.js';
import { RedisRTokenData, TokenPayloads } from '../../types/token.js';
import { AppConfigService } from '../../../core/config/config.service.js';

@Injectable()
export class TokenStoreService {
  private refreshKey(jti: string) {
    return `tokens:refresh:${jti}`;
  }
  private familyKey(id: string) {
    return `family:${id}`;
  }
  private userFamiliesKey(userId: string) {
    return `user:${userId}:families`;
  }

  constructor(
    private readonly redis: RedisService,
    private readonly config: AppConfigService,
  ) {}

  //Token operations

  async storeRToken(data: TokenPayloads['refresh']) {
    const { jti, familyId, userId } = data;
    const refreshTtl = this.config.jwt.refresh.ttl;
    //Creating token
    const createToken = this.redis.client.setEx(
      this.refreshKey(data.jti),
      refreshTtl,
      JSON.stringify({ jti, userId, familyId, used: false }),
    );
    //Creating family
    const createFamily = this.redis.client.setEx(this.familyKey(familyId), refreshTtl, jti);
    //Attaching family to user
    const attachFamily = this.redis.client.zAdd(this.userFamiliesKey(userId), {
      score: Date.now() + refreshTtl * 1000,
      value: familyId,
    });
    await Promise.all([createToken, createFamily, attachFamily]);
  }
  async getRToken(jti: string) {
    const value = await this.redis.client.get(this.refreshKey(jti));
    return !value ? null : (JSON.parse(value) as RedisRTokenData);
  }
  async familyExists(familyId: string) {
    return await this.redis.client.exists(this.familyKey(familyId));
  }
  async revokeRToken(jti: string) {
    const tokenData = await this.getRToken(jti);
    if (tokenData) {
      tokenData.used = true;
      await this.redis.client.set(this.refreshKey(jti), JSON.stringify(tokenData), {
        expiration: 'KEEPTTL',
      });
    }
  }
  async revokeFamily(userId: string, familyId: string) {
    //Getting jti and deleting family
    const deleteFamily = this.redis.client.getDel(this.familyKey(familyId));
    //Detaching family from user
    const detachFamily = this.redis.client.zRem(this.userFamiliesKey(userId), familyId);
    const [jti] = await Promise.all([
      deleteFamily,
      detachFamily,
      this.detachExpiredFamilies(userId),
    ]);
    //Deleting token
    if (jti) await this.redis.client.unlink(this.refreshKey(jti));
  }
  async revokeUserFamilies(userId: string) {
    //Getting user active families
    const getFamilyIds = this.redis.client.zRangeByScore(
      this.userFamiliesKey(userId),
      Date.now(),
      Infinity,
    );
    const [activeFamilyIds] = await Promise.all([getFamilyIds, this.detachExpiredFamilies(userId)]);
    //
    //Deleting active families and get their tokens' jti
    const deleteJtis = await Promise.all(
      activeFamilyIds.map((id) => this.redis.client.getDel(this.familyKey(id))),
    );
    const deleteTokensKeys = deleteJtis.reduce<string[]>((acc, jti) => {
      if (jti) acc.push(jti);
      return acc;
    }, []);
    //Deleting active refresh token
    const deleteTokens = this.redis.client.unlink(deleteTokensKeys);
    //Deleting user families set
    const deleteFamilies = this.redis.client.unlink(this.userFamiliesKey(userId));

    await Promise.all([deleteTokens, deleteFamilies]);
  }

  private async detachExpiredFamilies(userId: string) {
    await this.redis.client.zRemRangeByScore(this.userFamiliesKey(userId), -Infinity, Date.now());
  }
}
