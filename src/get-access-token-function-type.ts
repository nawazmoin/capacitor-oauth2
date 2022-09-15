import type { OAuth2AuthenticateOptions } from './definitions';
export type getAccessTokenFn=(config:OAuth2AuthenticateOptions)=>Promise<string>;