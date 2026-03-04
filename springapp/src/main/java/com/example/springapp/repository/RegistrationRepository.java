package com.example.springapp.repository;

import com.example.springapp.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByStudentStudentId(Long studentId);

    List<Registration> findByEventEventId(Long eventId);

    List<Registration> findByStudentEmail(String email);

    Optional<Registration> findByStudentStudentIdAndEventEventId(Long studentId, Long eventId);

    @Query("SELECT COUNT(r) FROM Registration r WHERE r.event.eventId = :eventId")
    Long countRegistrationsByEventId(@Param("eventId") Long eventId);

    @Query("SELECT r FROM Registration r WHERE r.student.studentId = :studentId AND r.attended = true")
    List<Registration> findAttendedEventsByStudent(@Param("studentId") Long studentId);
}