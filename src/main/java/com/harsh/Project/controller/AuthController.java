package com.harsh.Project.controller;

import com.harsh.Project.Repository.StudentRepository;
import com.harsh.Project.model.Student;
import com.harsh.Project.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ========== SIGNUP ==========
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String name = request.get("name");
        String enrollment = request.get("enrollment");
        String program = request.get("program");
        String branch = request.get("branch");

        // Validation
        if (email == null || password == null || name == null || enrollment == null) {
            return ResponseEntity.badRequest().body(errorResponse("All fields are required"));
        }

        if (password.length() < 6) {
            return ResponseEntity.badRequest().body(errorResponse("Password must be at least 6 characters"));
        }

        // Check duplicates
        if (studentRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse("Email already registered"));
        }

        if (studentRepository.existsByEnrollment(enrollment)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse("Enrollment number already registered"));
        }

        // Create student
        Student student = Student.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .enrollment(enrollment)
                .program(program != null ? program : "")
                .branch(branch != null ? branch : "")
                .build();

        studentRepository.save(student);

        // Generate JWT token
        String token = jwtUtil.generateToken(student.getEmail(), student.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", userInfo(student));
        response.put("message", "Signup successful");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ========== LOGIN ==========
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(errorResponse("Email and password are required"));
        }

        Optional<Student> studentOpt = studentRepository.findByEmail(email);

        if (studentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse("Invalid email or password"));
        }

        Student student = studentOpt.get();

        if (!passwordEncoder.matches(password, student.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse("Invalid email or password"));
        }

        // Generate unique JWT token for this user
        String token = jwtUtil.generateToken(student.getEmail(), student.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", userInfo(student));
        response.put("message", "Login successful");

        return ResponseEntity.ok(response);
    }

    // ========== GET CURRENT USER (Token Verification) ==========
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal Student student) {
        if (student == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse("Not authenticated"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("user", userInfo(student));

        return ResponseEntity.ok(response);
    }

    // ========== HELPERS ==========
    private Map<String, Object> userInfo(Student student) {
        Map<String, Object> info = new HashMap<>();
        info.put("id", student.getId());
        info.put("name", student.getName());
        info.put("email", student.getEmail());
        info.put("enrollment", student.getEnrollment());
        info.put("program", student.getProgram());
        info.put("branch", student.getBranch());
        return info;
    }

    private Map<String, String> errorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
