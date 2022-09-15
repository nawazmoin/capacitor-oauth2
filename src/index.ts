import { registerPlugin } from '@capacitor/core';
import {getAccessTokenFn} from './get-access-token-function-type';
import { OAuth2AuthenticateOptions, OAuth2ClientPlugin } from './definitions';

const OAuth2Client = registerPlugin<OAuth2ClientPlugin>('OAuth2Client', {
    web: () => import('./web').then(m => new m.OAuth2ClientPluginWeb()),
    // electron: () => ("./electron").then(m => new m.OAuth2ClientPluginElectron())
});

export * from './definitions';


const getAccessToken:getAccessTokenFn=async(settings:OAuth2AuthenticateOptions)=>{

    const response = await OAuth2Client.authenticate(settings);
    const accessToken = response['access_token_response']['access_token'];
    return accessToken;

}



// export const refreshAccessToken=async(settings:OAuth2AuthenticateOptions)=>{
//     const response = await OAuth2Client.refreshToken(settings);
//     const accessToken = response['access_token_response']['access_token'];
//     return accessToken;
// }

export { OAuth2Client, getAccessToken};
