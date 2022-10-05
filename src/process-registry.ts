import type { OAuth2AuthenticateOptions, AccessTokenPayload } from "./definitions";

interface Registry {
    [registryKey: string]: Promise<AccessTokenPayload>;
  }
  const registry: Registry = {};
  
  export function getProcessByKey (key: string) {
    return registry[key] || null;
  }
  
  export function deleteProcessByKey (key: string){
    delete registry[key];
  }
  
  export function storeProcessByKey (
    key: string,
    process: Promise<AccessTokenPayload>
  ) {
    registry[key] = process;
  }

  export function createIdentifier (settings: OAuth2AuthenticateOptions): string {
    return btoa(`${settings.appId}/${settings.scope}`);
  }
