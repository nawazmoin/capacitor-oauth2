import { RefreshTokenCache, TokenCache } from './token-cache.interface';
// import type {  AccessTokenPayload } from './definitions';

interface InMemoryTokenCache {
  [cacheKey: string]: string;
}

interface InMemoryExpiresAt {
  [cacheKey: string]: number;
}

/**
 * The actual token cache
 */
const tokenCache: InMemoryTokenCache = {};
const expiresAt: InMemoryExpiresAt = {};

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

  removeTokenExpiresAtFromCache(cacheKey: string): void {
    delete expiresAt[cacheKey];
  },

  getTokenExpiresAtFromCache(cacheKey: string): number {
    return expiresAt[cacheKey];
  },

  saveTokenExpiresAtToCache(cacheKey: string, expires_at: number): void {
    expiresAt[cacheKey] = expires_at;
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

