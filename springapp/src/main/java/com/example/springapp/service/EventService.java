package com.example.springapp.service;

import com.example.springapp.model.Event;
import com.example.springapp.model.EventCategory;
import com.example.springapp.repository.EventRepository;
import com.example.springapp.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event eventDetails) {
        return eventRepository.findById(id)
                .map(event -> {
                    event.setEventName(eventDetails.getEventName());
                    event.setDescription(eventDetails.getDescription());
                    event.setDate(eventDetails.getDate());
                    event.setTime(eventDetails.getTime());
                    event.setVenue(eventDetails.getVenue());
                    event.setDepartment(eventDetails.getDepartment());
                    event.setCapacity(eventDetails.getCapacity());
                    event.setCategory(eventDetails.getCategory());
                    return eventRepository.save(event);
                })
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public List<Event> getEventsByCategory(EventCategory category) {
        return eventRepository.findByCategory(category);
    }

    public List<Event> getEventsByDepartment(String department) {
        return eventRepository.findByDepartment(department);
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findByDateAfter(LocalDate.now());
    }

    public List<Event> getAvailableEvents() {
        return eventRepository.findAvailableEvents();
    }

    public boolean isEventFull(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        Long registrationCount = registrationRepository.countRegistrationsByEventId(eventId);
        return registrationCount >= event.getCapacity();
    }
}