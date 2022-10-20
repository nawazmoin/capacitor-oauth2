import type {  AccessTokenPayload } from './definitions';
 export interface TokenCache {
  removeTokenPayloadFromCache: (cacheKey: string) => void;
  getTokenPayloadFromCache: (cacheKey: string) => AccessTokenPayload;
  saveTokenPayloadToCache: (cacheKey: string, token: AccessTokenPayload, ttl?: number) => void;
}
