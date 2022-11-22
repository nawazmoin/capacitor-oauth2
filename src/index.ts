import { registerPlugin } from '@capacitor/core';
import {getProcessByKey, storeProcessByKey, createIdentifier, deleteProcessByKey} from './process-registry';
// import { inMemoryTokenCache} from './in-memory-token-cache';
import type { OAuth2AuthenticateOptions, OAuth2ClientPlugin , AccessTokenPayload, OAuth2RefreshTokenOptions } from './definitions';
import { setToSecureStorage, getFromSecureStorage, removeFromSecureStorage } from './capacitor-storage-cache';

const OAuth2Client = registerPlugin<OAuth2ClientPlugin>('OAuth2Client', {
    web: () => import('./web').then(m => new m.OAuth2ClientPluginWeb()),
    // electron: () => ("./electron").then(m => new m.OAuth2ClientPluginElectron())
});


const getAccessTokenNative = async(_settings:OAuth2AuthenticateOptions,forceRefresh?:boolean)=>{
    const settings = _settings;

    const registryKey = createIdentifier(settings);

    if (forceRefresh === true) {
        console.log("force refresh is true, removing access token from cache");
        
        await removeFromSecureStorage("access_token");
        // inMemoryTokenCache.removeTokenPayloadFromCache(registryKey);
    }
    else {
        try{
            const tokenFromCache = await getFromSecureStorage("access_token");
            if(tokenFromCache){
                const expires_at = await getFromSecureStorage("expires_at");
                console.log("found an access token in the secure storage, access token expires in",Number(expires_at)-Date.now());

                if(Number(expires_at)-Date.now()>0){
                    console.log("as access_token has not expired, getting it from cache ",tokenFromCache);
                    // const tokenFromCache = inMemoryTokenCache.getTokenPayloadFromCache(registryKey);
                    return tokenFromCache;
                }
            }
            else{
                console.log("there is currently no access token in the secure storage, going to check for refresh token");
            }
        }catch(e){
            //do nothing here
        }
    }

    console.log("going to start new process now");

    let process = getProcessByKey(registryKey);

    if (!process) {

        //start a new process
        process = createNewProcess(settings);
        // store the process until it is resolved
        storeProcessByKey(registryKey, process);

        let payload: AccessTokenPayload;
    
        payload = await process;

        await setToSecureStorage(payload.access_token,"access_token")
        await setToSecureStorage((payload.expires_at)+'',"expires_at");
        // inMemoryTokenCache.saveTokenPayloadToCache(registryKey, payload.access_token);

        if(payload.refresh_token){
            await setToSecureStorage(payload.refresh_token,"refresh_token");
            console.log("refresh token set in the secure storage ", await getFromSecureStorage("refresh_token"));
            // inMemoryRefreshTokenCache.saveRefreshTokenPayloadToCache(registryKey, payload.refresh_token)
        }

        // setTimeout(async ()=>{
        //     getAccessTokenNative(settings,true);
        // },payload.expires_in*1000)

        setTimeout(async ()=>{
            // await removeFromSecureStorage("access_token");
            getAccessTokenNative(settings,true);
        },3000)

    }

    const responsePayload: AccessTokenPayload = await process;

    deleteProcessByKey(registryKey);

    console.log("expires_at from GATN - ",responsePayload.expires_at)

    console.log("refresh token from GATN - ",responsePayload.refresh_token)

    return responsePayload.access_token;
}



async function createNewProcess(settings: OAuth2AuthenticateOptions) {
    // const registryKey = createIdentifier(settings);

    // const refreshTokenFromCache = inMemoryRefreshTokenCache.getRefreshTokenPayloadFromCache(registryKey);

    try{
        console.log("trying to get refresh token from storage");
        const refreshTokenFromCache = await getFromSecureStorage("refresh_token");
        if(refreshTokenFromCache){
            console.log("refresh token from cache is ",refreshTokenFromCache);
            try {
                let accessTokenPayload = await getAccessTokenFromRefreshToken(settings,refreshTokenFromCache);
                // let accessTokenPayload = await getAccessTokenFromRefreshToken(settings);
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
        console.log("no refresh token found in storage")
    }catch(e){
        // do nothing here
    }

    const response = await OAuth2Client.authenticate(settings);
    return response['access_token_response']
}

async function getAccessTokenFromRefreshToken(settings:OAuth2AuthenticateOptions, refreshTokenFromCache:string) {
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
        await removeFromSecureStorage("refresh_token");
        throw e;
        // getAccessTokenNative(settings,true)
    }
}


export * from './definitions';
export { OAuth2Client, getAccessTokenNative };



