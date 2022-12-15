// import type {  AccessTokenPayload } from './definitions';
export interface TokenCache {
  removeTokenPayloadFromCache: (cacheKey: string) => void;
  getTokenPayloadFromCache: (cacheKey: string) => string;
  saveTokenPayloadToCache: (cacheKey: string, token: string, ttl?: number) => void;
  removeTokenExpiresAtFromCache: (cacheKey: string) => void;
  getTokenExpiresAtFromCache: (cacheKey: string) => number;
  saveTokenExpiresAtToCache: (cacheKey: string, expires_at: number, ttl?: number) => void;
}
export interface RefreshTokenCache {
  removeRefreshTokenPayloadFromCache: (cacheKey: string) => void;
  getRefreshTokenPayloadFromCache: (cacheKey: string) => string;
  saveRefreshTokenPayloadToCache: (cacheKey: string, token: string, ttl?: number) => void;
}