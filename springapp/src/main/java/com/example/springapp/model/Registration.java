package com.example.springapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Registration {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long registrationId;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"registrations"})
    private Student student;
    
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    @JsonIgnoreProperties({"registrations"})
    private Event event;
    
    @Column(nullable = false)
    private LocalDateTime registrationDate;
    
    @Builder.Default
    @Column(nullable = false)
    private Boolean attended = false;
    
    @PrePersist
    protected void onCreate() {
        if (registrationDate == null) {
            registrationDate = LocalDateTime.now();
        }
    }
}
