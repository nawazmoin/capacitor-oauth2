import { registerPlugin } from '@capacitor/core';
import {getProcessByKey, storeProcessByKey, createIdentifier, deleteProcessByKey} from './process-registry';
import { inMemoryRefreshTokenCache, inMemoryTokenCache} from './in-memory-token-cache';
import type { OAuth2AuthenticateOptions, OAuth2ClientPlugin , AccessTokenPayload, OAuth2RefreshTokenOptions } from './definitions';
// import { Storage } from '@capacitor/storage';

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

        //start a new process
        process = createNewProcess(settings);
        // store the process until it is resolved
        storeProcessByKey(registryKey, process);

        let payload: AccessTokenPayload;
    
        payload = await process;

        inMemoryTokenCache.saveTokenPayloadToCache(registryKey, payload.access_token);

        if(payload.refresh_token){
            // await Storage.set({
            //     key: 'refreshToken',
            //     value: payload.refresh_token,
            // });
            inMemoryRefreshTokenCache.saveRefreshTokenPayloadToCache(registryKey, payload.refresh_token)
        }

        // setTimeout(async ()=>{
        //     getAccessTokenNative(settings,true);
        // },payload.expires_in*1000)

        setTimeout(async ()=>{
            getAccessTokenNative(settings,true);
        },(payload.expires_at-Date.now()))

    }

    const responsePayload: AccessTokenPayload = await process;

    deleteProcessByKey(registryKey);

    console.log("access token from GATN ",responsePayload.access_token)
    return Promise.resolve(responsePayload.access_token);
}





async function createNewProcess(settings: OAuth2AuthenticateOptions) {
    const registryKey = createIdentifier(settings);

    const refreshTokenFromCache = inMemoryRefreshTokenCache.getRefreshTokenPayloadFromCache(registryKey);

    // const { value } = await Storage.get({ key:'refreshToken' });

    if(refreshTokenFromCache){
        try {
            let accessTokenPayload = await getAccessTokenFromRefreshToken(settings,refreshTokenFromCache);
            // inMemoryTokenCache.saveTokenPayloadToCache(registryKey, accessTokenPayload.access_token);
            return accessTokenPayload;
        } catch (e) {
            if(e instanceof Error){
                if (e.message === 'Failure Response'){
                    console.error('Failed to fetch new AccessToken from the RefreshToken, RefreshToken must have Expired')
                    /* do nothing, since the fallback is .authenticate()*/ 
                }
                else {
                    throw e;
                }
            }
         }
    }

    const response = await OAuth2Client.authenticate(settings);
    return response['access_token_response']
    
}

async function getAccessTokenFromRefreshToken(settings:OAuth2AuthenticateOptions,refreshTokenFromCache: string) {
    const response = await OAuth2Client.refreshToken({...settings,refreshToken:refreshTokenFromCache} as OAuth2RefreshTokenOptions)
    if (!response['access_token']) {
        throw new Error('Failure Response');
    }
    return response;
}



export * from './definitions';
export { OAuth2Client, getAccessTokenNative };

    

