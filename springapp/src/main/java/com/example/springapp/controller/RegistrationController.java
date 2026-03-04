package com.example.springapp.controller;

import com.example.springapp.model.Registration;
import com.example.springapp.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @GetMapping
    public List<Registration> getAllRegistrations() {
        return registrationService.getAllRegistrations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Registration> getRegistrationById(@PathVariable Long id) {
        return registrationService.getRegistrationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/register/{studentId}/{eventId}")
    public ResponseEntity<?> registerStudentForEvent(
            @PathVariable Long studentId,
            @PathVariable Long eventId) {
        try {
            Registration registration = registrationService.registerStudentForEvent(studentId, eventId);
            return ResponseEntity.ok(registration);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelRegistration(@PathVariable Long id) {
        registrationService.cancelRegistration(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/attendance")
    public ResponseEntity<Registration> markAttendance(
            @PathVariable Long id,
            @RequestParam boolean attended) {
        try {
            Registration registration = registrationService.markAttendance(id, attended);
            return ResponseEntity.ok(registration);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/student/{studentId}")
    public List<Registration> getStudentRegistrations(@PathVariable Long studentId) {
        return registrationService.getStudentRegistrations(studentId);
    }

    @GetMapping("/event/{eventId}")
    public List<Registration> getEventRegistrations(@PathVariable Long eventId) {
        return registrationService.getEventRegistrations(eventId);
    }

    @GetMapping("/email/{email}")
    public List<Registration> getRegistrationsByEmail(@PathVariable String email) {
        return registrationService.getRegistrationsByEmail(email);
    }
}