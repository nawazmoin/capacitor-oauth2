import { registerPlugin } from '@capacitor/core';
import {getProcessByKey, storeProcessByKey, createIdentifier, deleteProcessByKey} from './process-registry';
import { inMemoryTokenCache} from './in-memory-token-cache';
import type { OAuth2AuthenticateOptions, OAuth2ClientPlugin , AccessTokenPayload, OAuth2RefreshTokenOptions } from './definitions';
import { setRefreshToken, getRefreshToken, removeRefreshToken } from './capacitor-storage-cache';

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
            await setRefreshToken(payload.refresh_token);
            console.log("refresh token set in the secure storage ", await getRefreshToken());
            // inMemoryRefreshTokenCache.saveRefreshTokenPayloadToCache(registryKey, payload.refresh_token)
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
    // const registryKey = createIdentifier(settings);

    // const refreshTokenFromCache = inMemoryRefreshTokenCache.getRefreshTokenPayloadFromCache(registryKey);

    try{
        const refreshTokenFromCache = await getRefreshToken();
        if(refreshTokenFromCache){
            console.log("refresh token from cache is ",refreshTokenFromCache);
            try {
                // let accessTokenPayload = await getAccessTokenFromRefreshToken(settings,refreshTokenFromCache);
                let accessTokenPayload = await getAccessTokenFromRefreshToken(settings,refreshTokenFromCache);
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
    }catch(e){
        //do nothing here
    }

    const response = await OAuth2Client.authenticate(settings);
    return response['access_token_response']
}

async function getAccessTokenFromRefreshToken(settings:OAuth2AuthenticateOptions,refreshTokenFromCache: string) {
    console.log("going to send a request to fetch access token with refresh token, please verify these settings:-");
    console.log("appId:-",settings.appId);
    console.log("accessTokenEndpoint:-",settings.accessTokenEndpoint);
    console.log("refreshToken:-",refreshTokenFromCache);
    console.log("scope:-",settings.scope);
    console.log("clientSecret:-",settings.clientSecret);
    console.log("additionalResourceHeaders:-",settings.additionalResourceHeaders);

    try{
        const response = await OAuth2Client.refreshToken({...settings,refreshToken:refreshTokenFromCache} as OAuth2RefreshTokenOptions)
        if (!response['access_token']) {
            throw new Error('Failure Response');
        }
        return response;
    } catch(e){
        await removeRefreshToken();
        getAccessTokenNative(settings,true)
    }
}


export * from './definitions';
export { OAuth2Client, getAccessTokenNative };



