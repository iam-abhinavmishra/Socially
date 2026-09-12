package com.socialapp.socialbackend.auth;

public class GoogleLoginRequest {

    private String credential;

    public GoogleLoginRequest() {
    }

    public String getCredential() {
        return credential;
    }

    public void setCredential(String credential) {
        this.credential = credential;
    }
}