package com.byteowls.capacitor.oauth2;

import java.util.Map;

public class OAuth2RefreshTokenOptions {

    private String appId;
    private String accessTokenEndpoint;
    private String refreshToken;
    private String scope;
    private String clientSecret;
    private Map<String, String> additionalResourceHeaders;

    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
    }

    public String getAccessTokenEndpoint() {
        return accessTokenEndpoint;
    }

    public void setAccessTokenEndpoint(String accessTokenEndpoint) {
        this.accessTokenEndpoint = accessTokenEndpoint;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public Map<String, String> getAdditionalResourceHeaders() {
        return additionalResourceHeaders;
    }

    public void setClientSecret(String clientSecret) {
      this.clientSecret = clientSecret;
    }

    public String getClientSecret() {  return clientSecret;  }

    public void setAdditionalResourceHeaders(Map<String, String> additionalResourceHeaders) {
      this.additionalResourceHeaders = additionalResourceHeaders;
    }

}
