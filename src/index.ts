import { registerPlugin } from '@capacitor/core';
import {getProcessByKey, storeProcessByKey, createIdentifier, deleteProcessByKey} from './process-registry';
// import { inMemoryTokenCache} from './in-memory-token-cache';
import type { OAuth2AuthenticateOptions, OAuth2ClientPlugin , AccessTokenPayload } from './definitions';
import { Preferences } from '@capacitor/preferences';

const OAuth2Client = registerPlugin<OAuth2ClientPlugin>('OAuth2Client', {
    web: () => import('./web').then(m => new m.OAuth2ClientPluginWeb()),
    // electron: () => ("./electron").then(m => new m.OAuth2ClientPluginElectron())
});


const getAccessTokenNative = async(settings:OAuth2AuthenticateOptions,forceRefresh?:boolean)=>{

    const registryKey = createIdentifier(settings);

    if (forceRefresh === true) {
        await Preferences.remove({key:'access_token_payload'})
        // inMemoryTokenCache.removeTokenPayloadFromCache(registryKey);
    }
    else {
        const { value } = await Preferences.get({ key:'access_token_payload' })
        const tokenPayload = JSON.parse(value || '{}');
        // const tokenPayload = inMemoryTokenCache.getTokenPayloadFromCache(registryKey);
        if (tokenPayload != null) {
          return tokenPayload.access_token;
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
        
        await Preferences.set({key:'access_token_payload',value:JSON.stringify(payload)})

        // inMemoryTokenCache.saveTokenPayloadToCache(registryKey, payload);

    }

    const responsePayload: AccessTokenPayload = await process;

    deleteProcessByKey(registryKey);

    return Promise.resolve(responsePayload.access_token);
}

async function createNewProcess(settings: OAuth2AuthenticateOptions) {

        const response = await OAuth2Client.authenticate(settings);
        let accessToken = response['access_token_response']['access_token']
        return { access_token:accessToken }
}



export * from './definitions';
export { OAuth2Client, getAccessTokenNative };

