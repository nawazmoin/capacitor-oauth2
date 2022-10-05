import type { OAuth2AuthenticateOptions, AccessTokenPayload, GetProcessByKey, DeleteProcessByKey, StoreProcessByKey, CreateIdentifier } from "./definitions";

interface Registry {
    [registryKey: string]: Promise<AccessTokenPayload>;
  }
  const registry: Registry = {};
  
  export const getProcessByKey:GetProcessByKey = function (key: string) {
    return registry[key] || null;
  }
  
  export const deleteProcessByKey:DeleteProcessByKey = function(key: string){
    delete registry[key];
  }
  
  export const storeProcessByKey:StoreProcessByKey = function(
    key: string,
    process: Promise<AccessTokenPayload>
  ) {
    registry[key] = process;
  }

  export const createIdentifier:CreateIdentifier = function(settings: OAuth2AuthenticateOptions): string {
    return btoa(`${settings.appId}/${settings.scope}`);
  }
