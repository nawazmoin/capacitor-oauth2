import { TokenCache } from './token-cache.interface';
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
