import { RefreshTokenCache, TokenCache } from './token-cache.interface';
// import type {  AccessTokenPayload } from './definitions';

interface InMemoryTokenCache {
  [cacheKey: string]: string;
}

/**
 * The actual token cache
 */
const tokenCache: InMemoryTokenCache = {};

export const inMemoryTokenCache: TokenCache = {
  removeTokenPayloadFromCache(cacheKey: string): void {
        delete tokenCache[cacheKey];
  },

  getTokenPayloadFromCache(cacheKey: string): string {
    return tokenCache[cacheKey];
  },

  saveTokenPayloadToCache(cacheKey: string, token: string): void {
    tokenCache[cacheKey] = token;
  },
};

//for refresh token caching
interface InMemoryRefreshTokenCache {
  [cacheKey: string]: string;
}

const refreshTokenCache: InMemoryRefreshTokenCache = {};

export const inMemoryRefreshTokenCache: RefreshTokenCache = {
  removeRefreshTokenPayloadFromCache(cacheKey: string): void {
        delete tokenCache[cacheKey];
  },

  getRefreshTokenPayloadFromCache(cacheKey: string): string {
    return refreshTokenCache[cacheKey];
  },

  saveRefreshTokenPayloadToCache(cacheKey: string, token: string): void {
    refreshTokenCache[cacheKey] = token;
  },
};

