import { registerPlugin } from '@capacitor/core';
import {getProcessByKey, storeProcessByKey, createIdentifier} from './process-registry';
import type { OAuth2AuthenticateOptions, OAuth2ClientPlugin , AccessTokenPayload } from './definitions';

const OAuth2Client = registerPlugin<OAuth2ClientPlugin>('OAuth2Client', {
    web: () => import('./web').then(m => new m.OAuth2ClientPluginWeb()),
    // electron: () => ("./electron").then(m => new m.OAuth2ClientPluginElectron())
});


const getAccessTokenNative = async(settings:OAuth2AuthenticateOptions)=>{

    const registryKey = createIdentifier(settings);

    let process = getProcessByKey(registryKey);

    if (!process) {
        //start a new process
        process = createNewProcess(settings);
        // store the process until it is resolved
        storeProcessByKey(registryKey, process);

        let payload: AccessTokenPayload;
        try{
            payload = await process;
            return payload.access_token;
        }catch(e){
            return Promise.reject(e);
        }
    }

    const responsePayload: AccessTokenPayload = await process;
    return Promise.resolve(responsePayload.access_token);

    
}

async function createNewProcess(settings: OAuth2AuthenticateOptions) {

    try{
        const response = await OAuth2Client.authenticate(settings);
        let accessToken = response['access_token_response']['access_token']
        return { access_token:accessToken }
    }catch(e){
        throw new Error("An Error Occured")
    }
}



export * from './definitions';
export { OAuth2Client, getAccessTokenNative };

