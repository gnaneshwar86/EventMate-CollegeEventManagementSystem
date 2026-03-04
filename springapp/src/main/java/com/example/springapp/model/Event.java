package com.example.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;

    @NotNull(message = "Event name is required")
    @Size(min = 5, max = 100, message = "eventName must be between 5 and 100 characters")
    private String eventName;

    private String description;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Time is required")
    private String time;

    @NotNull(message = "Venue is required")
    private String venue;

    @NotNull(message = "Department is required")
    private String department;

    @PositiveOrZero(message = "Current capacity cannot be negative")
    private Integer currentCapacity = 0;

    @Positive(message = "Capacity must be a positive number")
    private Integer capacity;

    @Enumerated(EnumType.STRING)
    @Column(length = 50, nullable = false)
    @NotNull(message = "Event Category is required")
    private EventCategory category;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({ "event" })
    private List<Registration> registrations;
}
