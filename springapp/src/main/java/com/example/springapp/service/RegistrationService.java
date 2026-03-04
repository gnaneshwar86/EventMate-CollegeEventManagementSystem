package com.example.springapp.service;

import com.example.springapp.model.Registration;
import com.example.springapp.model.Event;
import com.example.springapp.model.Student;
import com.example.springapp.repository.RegistrationRepository;
import com.example.springapp.repository.EventRepository;
import com.example.springapp.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final StudentRepository studentRepository;
    private final EventService eventService;

    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    public Optional<Registration> getRegistrationById(Long id) {
        return registrationRepository.findById(id);
    }

    public Registration registerStudentForEvent(Long studentId, Long eventId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Check if already registered
        if (registrationRepository.findByStudentStudentIdAndEventEventId(studentId, eventId).isPresent()) {
            throw new RuntimeException("Student already registered for this event");
        }

        // Check if event is full
        if (eventService.isEventFull(eventId)) {
            throw new RuntimeException("Event is full");
        }

        Registration registration = Registration.builder()
                .student(student)
                .event(event)
                .attended(false)
                .build();

        Registration savedRegistration = registrationRepository.save(registration);

        // Update current capacity (handle potential null from legacy data)
        Integer current = event.getCurrentCapacity();
        event.setCurrentCapacity((current != null ? current : 0) + 1);
        eventRepository.save(event);

        return savedRegistration;
    }

    public void cancelRegistration(Long registrationId) {
        registrationRepository.findById(registrationId).ifPresent(registration -> {
            Event event = registration.getEvent();
            if (event.getCurrentCapacity() > 0) {
                event.setCurrentCapacity(event.getCurrentCapacity() - 1);
                eventRepository.save(event);
            }
            registrationRepository.deleteById(registrationId);
        });
    }

    public Registration markAttendance(Long registrationId, boolean attended) {
        return registrationRepository.findById(registrationId)
                .map(registration -> {
                    registration.setAttended(attended);
                    return registrationRepository.save(registration);
                })
                .orElseThrow(() -> new RuntimeException("Registration not found"));
    }

    public List<Registration> getStudentRegistrations(Long studentId) {
        return registrationRepository.findByStudentStudentId(studentId);
    }

    public List<Registration> getEventRegistrations(Long eventId) {
        return registrationRepository.findByEventEventId(eventId);
    }

    public List<Registration> getRegistrationsByEmail(String email) {
        return registrationRepository.findByStudentEmail(email);
    }
}