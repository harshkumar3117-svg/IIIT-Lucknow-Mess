package com.harsh.Project.controller;

import com.harsh.Project.Repository.MealAnnouncementRepository;
import com.harsh.Project.Repository.NotificationRepository;
import com.harsh.Project.model.MealAnnouncement;
import com.harsh.Project.model.Notification;
import com.harsh.Project.model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private MealAnnouncementRepository announcementRepository;

    private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    // ─────────────────────────────────────────────────────────────────
    // GET /api/notifications/public  — NO auth required.
    //   Returns today's GLOBAL meal announcements from MealAnnouncement
    //   table — works even when no students are registered.
    //   Guests use localStorage to track dismiss state.
    // ─────────────────────────────────────────────────────────────────
    @GetMapping("/public")
    public ResponseEntity<?> getPublicNotifications() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay   = LocalDate.now().atTime(LocalTime.MAX);

        List<MealAnnouncement> announcements =
                announcementRepository.findByCreatedAtBetweenOrderByCreatedAtAsc(startOfDay, endOfDay);

        List<Map<String, Object>> body = announcements.stream()
                .map(a -> Map.<String, Object>of(
                        "mealType",  a.getMealType(),
                        "title",     a.getTitle(),
                        "message",   a.getMessage(),
                        "emoji",     a.getEmoji(),
                        "createdAt", a.getCreatedAt().format(FMT)
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(body);
    }

    // ─────────────────────────────────────────────────────────────────
    // GET /api/notifications  — JWT required (logged-in students only).
    //   Returns per-student unseen notifications with DB-tracked dismiss.
    // ─────────────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<?> getUnseenNotifications(
            @AuthenticationPrincipal Student student) {

        if (student == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }

        List<Notification> notifications =
                notificationRepository.findByStudentAndSeenFalseOrderByCreatedAtDesc(student);

        List<Map<String, Object>> body = notifications.stream()
                .map(this::toMap)
                .collect(Collectors.toList());

        return ResponseEntity.ok(body);
    }

    // ─────────────────────────────────────────────────────────────────
    // PATCH /api/notifications/{id}/seen  — mark a single notification seen
    // ─────────────────────────────────────────────────────────────────
    @PatchMapping("/{id}/seen")
    public ResponseEntity<?> markSeen(
            @PathVariable Long id,
            @AuthenticationPrincipal Student student) {

        if (student == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }

        Optional<Notification> opt = notificationRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Notification notification = opt.get();

        // Security: ensure the notification belongs to this student
        if (!notification.getStudent().getId().equals(student.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied"));
        }

        notification.setSeen(true);
        notificationRepository.save(notification);

        return ResponseEntity.ok(Map.of("message", "Notification marked as seen"));
    }

    // ─────────────────────────────────────────────────────────────────
    // PATCH /api/notifications/seen-all  — mark ALL unseen notifications seen
    // ─────────────────────────────────────────────────────────────────
    @PatchMapping("/seen-all")
    public ResponseEntity<?> markAllSeen(
            @AuthenticationPrincipal Student student) {

        if (student == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }

        notificationRepository.markAllSeenForStudent(student);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as seen"));
    }

    // ─────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────

    /** For logged-in student endpoint (includes DB id for dismiss calls) */
    private Map<String, Object> toMap(Notification n) {
        return Map.of(
                "id",        n.getId(),
                "mealType",  n.getMealType(),
                "title",     n.getTitle(),
                "message",   n.getMessage(),
                "emoji",     n.getEmoji(),
                "createdAt", n.getCreatedAt().format(FMT),
                "seen",      n.isSeen()
        );
    }

    /** For public endpoint — uses mealType as identifier (no DB id exposed) */
    private Map<String, Object> toPublicMap(Notification n) {
        return Map.of(
                "mealType",  n.getMealType(),
                "title",     n.getTitle(),
                "message",   n.getMessage(),
                "emoji",     n.getEmoji(),
                "createdAt", n.getCreatedAt().format(FMT)
        );
    }
}
