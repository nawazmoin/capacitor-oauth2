import { registerPlugin } from '@capacitor/core';
import {getProcessByKey, storeProcessByKey, createIdentifier, deleteProcessByKey} from './process-registry';
import { inMemoryRefreshTokenCache, inMemoryTokenCache} from './in-memory-token-cache';
import type { OAuth2AuthenticateOptions, OAuth2ClientPlugin , AccessTokenPayload, OAuth2RefreshTokenOptions } from './definitions';

const OAuth2Client = registerPlugin<OAuth2ClientPlugin>('OAuth2Client', {
    web: () => import('./web').then(m => new m.OAuth2ClientPluginWeb()),
    // electron: () => ("./electron").then(m => new m.OAuth2ClientPluginElectron())
});


const getAccessTokenNative = async(settings:OAuth2AuthenticateOptions,forceRefresh?:boolean)=>{

    const registryKey = createIdentifier(settings);

    if (forceRefresh === true) {
        inMemoryTokenCache.removeTokenPayloadFromCache(registryKey);
    }
    else {
        const tokenFromCache = inMemoryTokenCache.getTokenPayloadFromCache(registryKey);
        if (tokenFromCache != null) {
          return tokenFromCache;
        }
      }

    let process = getProcessByKey(registryKey);

    if (!process) {

        const refreshTokenFromCache = inMemoryRefreshTokenCache.getRefreshTokenPayloadFromCache(registryKey);
        if(refreshTokenFromCache){
            let accessToken:string = await getAccessTokenFromRefreshToken(settings,refreshTokenFromCache)
            return accessToken;
        }

        //start a new process
        process = createNewProcess(settings);
        // store the process until it is resolved
        storeProcessByKey(registryKey, process);

        let payload: AccessTokenPayload;
    
        payload = await process;

        
        console.log("payload expires in",payload.expires_at);
        inMemoryTokenCache.saveTokenPayloadToCache(registryKey, payload.access_token);
        inMemoryRefreshTokenCache.saveRefreshTokenPayloadToCache(registryKey, payload.refresh_token)

        setTimeout(async ()=>{
            console.log("5 seconds completed")
            getAccessTokenNative(settings,true);
        },5000)

    }

    const responsePayload: AccessTokenPayload = await process;

    deleteProcessByKey(registryKey);

    return Promise.resolve(responsePayload.access_token);
}





async function createNewProcess(settings: OAuth2AuthenticateOptions) {
    const response = await OAuth2Client.authenticate(settings);
    let accessToken = response['access_token_response']['access_token']
    let refreshToken = response['access_token_response']['refresh_token']
    let expires_at = response['access_token_response']['expires_at']
    return { access_token:accessToken , refresh_token:refreshToken, expires_at }
}

async function getAccessTokenFromRefreshToken(settings:OAuth2AuthenticateOptions,refreshTokenFromCache: string): Promise<string> {
    const response = await OAuth2Client.refreshToken({...settings,refreshToken:refreshTokenFromCache} as OAuth2RefreshTokenOptions)
    let accessToken = response['access_token']
    return accessToken
}



export * from './definitions';
export { OAuth2Client, getAccessTokenNative };

    

