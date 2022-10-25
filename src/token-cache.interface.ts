// import type {  AccessTokenPayload } from './definitions';
export interface TokenCache {
  removeTokenPayloadFromCache: (cacheKey: string) => void;
  getTokenPayloadFromCache: (cacheKey: string) => string;
  saveTokenPayloadToCache: (cacheKey: string, token: string, ttl?: number) => void;
}
export interface RefreshTokenCache {
  removeRefreshTokenPayloadFromCache: (cacheKey: string) => void;
  getRefreshTokenPayloadFromCache: (cacheKey: string) => string;
  saveRefreshTokenPayloadToCache: (cacheKey: string, token: string, ttl?: number) => void;
}