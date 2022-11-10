// import fetchMock from "jest-fetch-mock";

// eslint-disable-next-line
let root: any;




function mockFetch(status: number, data?: { [key: string]: string }[]) {
    const xhrMockObj = {
      open: jest.fn(),
      send: jest.fn(),
      setRequestHeader: jest.fn(),
      readyState: 4,
      status,
      response: JSON.stringify(data),
    };
  
    const xhrMockClass = () => xhrMockObj;
  
    // @ts-ignore
    window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);
  
    setTimeout(() => {
      // @ts-ignore
      xhrMockObj['onreadystatechange']();
    }, 0);
  }

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

    it("should call getAccessTokenNative function with forceRefresh true when expiry time runs out",async ()=>{
        root = require("./index");
        const authenticate = require("./web.ts");
        const obj = new authenticate.OAuth2ClientPluginWeb()

        const mockAuthenticate = jest.spyOn(obj.authenticate(settings), 'authenticate');
        mockAuthenticate.mockImplementation(() =>{
            const data = {
                access_token_respons:{
                    access_token: "1234",
                    expires_at: "1668089480",
                    refresh_token:"1234"
                }
            };
            return data
        });


        root.getAccessTokenNative(settings)

    })
})