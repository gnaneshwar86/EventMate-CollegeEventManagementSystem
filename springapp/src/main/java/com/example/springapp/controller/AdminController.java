package com.example.springapp.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @GetMapping
    public Map<String, Object> getAdminDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("message", "Welcome to Admin Dashboard!");
        dashboard.put("totalUsers", 150);
        dashboard.put("totalOrders", 1250);
        dashboard.put("revenue", 45000.00);
        return dashboard;
    }

    @GetMapping("/users")
    public Map<String, Object> getUsers() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Users data");
        response.put("users", new String[]{"user1", "user2", "user3"});
        return response;
    }
}
