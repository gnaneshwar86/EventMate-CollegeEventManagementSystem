package com.example.springapp.controller;

import com.example.springapp.dto.AuthResponse;
import com.example.springapp.dto.LoginRequest;
import com.example.springapp.dto.RegisterRequest;
import com.example.springapp.model.Admin;
import com.example.springapp.repository.AdminRepository;
import com.example.springapp.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    AdminRepository adminRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateAdmin(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            Admin admin = adminRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("Admin not found"));

            return ResponseEntity.ok(new AuthResponse(jwt, admin));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid credentials");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerAdmin(@RequestBody RegisterRequest signUpRequest) {
        Map<String, String> response = new HashMap<>();

        if (adminRepository.existsByUsername(signUpRequest.getUsername())) {
            response.put("message", "Username is already taken!");
            return ResponseEntity.badRequest().body(response);
        }

        if (adminRepository.existsByEmail(signUpRequest.getEmail())) {
            response.put("message", "Email is already in use!");
            return ResponseEntity.badRequest().body(response);
        }

        // Create new admin account
        Admin admin = new Admin(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        adminRepository.save(admin);

        response.put("message", "Admin registered successfully!");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getAdminProfile(Authentication authentication) {
        if (authentication == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Access denied");
            return ResponseEntity.badRequest().body(error);
        }

        Admin admin = adminRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        return ResponseEntity.ok(admin);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutAdmin() {
        SecurityContextHolder.clearContext();
        Map<String, String> response = new HashMap<>();
        response.put("message", "Admin logged out successfully!");
        return ResponseEntity.ok(response);
    }
}