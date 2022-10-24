import type {  AccessTokenPayload } from './definitions';
 export interface TokenCache {
  removeTokenPayloadFromCache: (cacheKey: string) => void;
  getTokenPayloadFromCache: (cacheKey: string) => AccessTokenPayload;
  saveTokenPayloadToCache: (cacheKey: string, token: AccessTokenPayload, ttl?: number) => void;
}


export interface refreshTokenCache {
  removeRefreshTokenFromCache: (cacheKey: string) => void;
  getRefreshTokenFromCache: (cacheKey: string) => string;
  saveRefreshTokenToCache: (cacheKey: string, token: string, ttl?: number) => void;
}