package com.example.springapp.repository;

import com.example.springapp.model.Event;
import com.example.springapp.model.EventCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCategory(EventCategory category);
    List<Event> findByDepartment(String department);
    List<Event> findByDateAfter(LocalDate date);
    List<Event> findByDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT e FROM Event e WHERE e.eventName LIKE %:name%")
    List<Event> findByEventNameContaining(@Param("name") String name);

    @Query("SELECT e FROM Event e WHERE e.capacity > (SELECT COUNT(r) FROM Registration r WHERE r.event = e)")
    List<Event> findAvailableEvents();
}