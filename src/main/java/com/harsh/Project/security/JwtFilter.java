package com.harsh.Project.security;

import com.harsh.Project.Repository.StudentRepository;
import com.harsh.Project.model.Student;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private StudentRepository studentRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // If no Bearer token, skip
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            String email = jwtUtil.extractEmail(token);

            // Only process if not already authenticated
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                Optional<Student> studentOpt = studentRepository.findByEmail(email);

                if (studentOpt.isPresent()) {
                    Student student = studentOpt.get();

                    // Validate: token belongs to this user and not expired
                    if (jwtUtil.validateToken(token, student.getEmail())) {
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(
                                        student, null, student.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }
        } catch (Exception e) {
            // Invalid token — do nothing, request will be unauthenticated
            logger.warn("JWT validation failed: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
