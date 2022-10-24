import { TokenCache, refreshTokenCache } from './token-cache.interface';
import type {  AccessTokenPayload } from './definitions';

interface InMemoryTokenCache {
  [cacheKey: string]: AccessTokenPayload;
}

/**
 * The actual token cache
 */
const tokenCache: InMemoryTokenCache = {};

export const inMemoryTokenCache: TokenCache = {
  removeTokenPayloadFromCache(cacheKey: string): void {
        delete tokenCache[cacheKey];
  },

  getTokenPayloadFromCache(cacheKey: string): AccessTokenPayload {
    return tokenCache[cacheKey];
  },

  saveTokenPayloadToCache(cacheKey: string, token: AccessTokenPayload): void {
    tokenCache[cacheKey] = token;
  },
};


interface InMemoryRefreshTokenCache {
  [cacheKey: string]: string;
}

/**
 * The actual token cache
 */
const refreshTokenCache: InMemoryRefreshTokenCache = {};

export const inMemoryRefreshTokenCache: refreshTokenCache = {
  removeRefreshTokenFromCache(cacheKey: string): void {
        delete refreshTokenCache[cacheKey];
  },

  getRefreshTokenFromCache(cacheKey: string): string {
    return refreshTokenCache[cacheKey];
  },

  saveRefreshTokenToCache(cacheKey: string, token: string): void {
    refreshTokenCache[cacheKey] = token;
  },
};