package com.example.springapp.dto;

import com.example.springapp.model.Admin;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Admin admin;

    public AuthResponse(String token, Admin admin) {
        this.token = token;
        this.admin = admin;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Admin getAdmin() { return admin; }
    public void setAdmin(Admin admin) { this.admin = admin; }
}
