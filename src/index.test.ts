// // import fetchMock from "jest-fetch-mock";
import { OAuth2Client } from './index';
// // eslint-disable-next-line
// let root: any;

const clientId = 'client_id';
const clientSecret = 'clientsecret';

const settings = {
  clientId,
  clientSecret,
  redirectUri: '',
  oauthEndpointAuthorize: 'access_token_endpoint',
  oauthEndpointToken: 'oauthendpoint_token',
  deviceName: 'device_name',
  authorizationBaseUrl: 'authorization_base_url',
  accessTokenEndpoint: 'access_token_endpoint',
  resourceUrl: '',
  logsEnabled: true,
  pkceEnabled: true,
  appId: clientId,
  scope: 'dev',
  additionalResourceHeaders: {
    userAgentB64: 'btoa(window.navigator.userAgent)',
    deviceNameB64: 'devicename',
    authorization: 'Basic btoa(`${clientId}:${clientSecret}`',
  },
  web: {
    appId: "appid",
    responseType: 'code', // implicit flow
    redirectUrl: 'http://localhost:3000',
    windowOptions: 'height=600,left=0,top=0',
  },

  android: {
    responseType: 'responseType', // if you configured a ios app in google dev console the value must be "code"
    redirectUrl: 'redirectUrl', // Bundle ID from google dev console
    pkceEnabled: true,
    scope: 'scope',
    accessTokenEndpoint: 'accessTokenEndpoint',
    additionalResourceHeaders: {
      authorization: 'Basic ',
    },
  }
}


// function mockFetch(status: number, data?: { [key: string]: string }[]) {
//     const xhrMockObj = {
//       open: jest.fn(),
//       send: jest.fn(),
//       setRequestHeader: jest.fn(),
//       readyState: 4,
//       status,
//       response: JSON.stringify(data),
//     };
  
//     const xhrMockClass = () => xhrMockObj;
  
//     // @ts-ignore
//     window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);
  
//     setTimeout(() => {
//       // @ts-ignore
//       xhrMockObj['onreadystatechange']();
//     }, 0);
//   }

describe("GetAccessTokenNativeProcess", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
        jest.useFakeTimers();
        jest.clearAllTimers();
        // @ts-ignore
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    // it("should call getAccessTokenNative function with forceRefresh true when expiry time runs out",async ()=>{
    //     const root = require("./index");
    //     // const authenticate = require("./web.ts");
    //     // const obj = new authenticate.OAuth2ClientPluginWeb()

    //     const mockAuthenticate = jest.spyOn(OAuth2Client, 'authenticate');
    //     // const mockAuthenticate = jest.spyOn(obj.authenticate(settings), 'authenticate');

    //     // mockAuthenticate.mockReturnValue(Promise.resolve({ 
    //     //   access_token_response : {
    //     //     access_token:"access_token",
    //     //     refresh_token:"refresh_token",
    //     //     expires_at:1763129818
    //     //   }
    //     //  }))        


    //     mockAuthenticate.mockImplementation({
    //       // @ts-ignore
    //          authenticate : () => {
    //           return { 
    //             access_token_response : {
    //               access_token:"access_token",
    //               refresh_token:"refresh_token",
    //               expires_at:1763129818
    //             } 
    //           }
    //         },
    //       // @ts-ignore
    //         refreshToken : () => {
    //           return {
    //             access_token:"access_token",
    //           }
    //         }
    //     });


    //     root.getAccessTokenNative(settings)

    // })

it("should call getAccessTokenNative function with forceRefresh true when expiry time runs out",async ()=>{

})
})