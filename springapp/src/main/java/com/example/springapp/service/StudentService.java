package com.example.springapp.service;

import com.example.springapp.model.Student;
import com.example.springapp.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Optional<Student> getStudentByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    public Student createStudent(Student student) {
        Optional<Student> existingStudent = studentRepository.findByEmail(student.getEmail());
        if (existingStudent.isPresent()) {
            return existingStudent.get();
        }
        return studentRepository.save(student);
    }

    public Student updateStudent(Long id, Student studentDetails) {
        return studentRepository.findById(id)
                .map(student -> {
                    student.setName(studentDetails.getName());
                    student.setEmail(studentDetails.getEmail());
                    student.setPhoneNumber(studentDetails.getPhoneNumber());
                    student.setDepartment(studentDetails.getDepartment());
                    student.setYear(studentDetails.getYear());
                    return studentRepository.save(student);
                })
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
}