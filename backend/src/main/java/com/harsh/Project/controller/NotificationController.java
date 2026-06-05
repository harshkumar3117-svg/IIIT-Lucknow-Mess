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
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

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
                .map(a -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("mealType", a.getMealType());
                    map.put("title", a.getTitle());
                    map.put("message", a.getMessage());
                    map.put("emoji", a.getEmoji());
                    map.put("createdAt", a.getCreatedAt() != null ? a.getCreatedAt().format(FMT) : null);
                    return map;
                })
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
    // POST /api/notifications/trigger-now  — NO auth required (dev/test).
    //   Manually inserts a MealAnnouncement for the meal currently being
    //   served in IST (Asia/Kolkata).  Idempotent — skips if already saved.
    //   Meal windows: Breakfast 07:30–09:30 | Lunch 12:30–14:30
    //                 Snacks 16:30–18:00    | Dinner 20:00–22:00
    // ─────────────────────────────────────────────────────────────────
    @PostMapping("/trigger-now")
    public ResponseEntity<?> triggerNow() {
        ZoneId ist = ZoneId.of("Asia/Kolkata");
        LocalDateTime now = LocalDateTime.now(ist);
        int total = now.getHour() * 60 + now.getMinute();

        String mealType, title, message, emoji;

        if      (total >= 450  && total < 570)  { mealType = "BREAKFAST"; title = "🌅 Breakfast is ready!";        message = "Head to the mess — Breakfast is being served now. (7:30 AM – 9:30 AM)";            emoji = "🍳"; }
        else if (total >= 750  && total < 870)  { mealType = "LUNCH";     title = "☀️ Lunch is ready!";            message = "It's lunchtime — come enjoy your meal at the mess. (12:30 PM – 2:30 PM)";         emoji = "🍛"; }
        else if (total >= 990  && total < 1080) { mealType = "SNACKS";    title = "🍵 Snacks are being served!";   message = "Evening snacks are available at the mess counter. (4:30 PM – 6:00 PM)";           emoji = "🥪"; }
        else if (total >= 1200 && total < 1320) { mealType = "DINNER";    title = "🌙 Dinner is ready!";           message = "Dinner is being served — come to the mess. (8:00 PM – 10:00 PM)";               emoji = "🍲"; }
        else {
            return ResponseEntity.ok(Map.of(
                "message", "No meal being served right now in IST. Current IST time: " + now.toLocalTime()
            ));
        }

        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay   = now.toLocalDate().atTime(LocalTime.MAX);

        boolean alreadyExists = announcementRepository.existsTodayAnnouncement(mealType, startOfDay, endOfDay);
        if (alreadyExists) {
            return ResponseEntity.ok(Map.of(
                "message", mealType + " announcement already exists for today — no duplicate created."
            ));
        }

        announcementRepository.save(
            MealAnnouncement.builder()
                .mealType(mealType)
                .title(title)
                .message(message)
                .emoji(emoji)
                .createdAt(now)
                .build()
        );

        return ResponseEntity.ok(Map.of(
            "message", "✅ " + mealType + " announcement saved successfully."
        ));
    }

    // ─────────────────────────────────────────────────────────────────
    // POST /api/notifications/test-insert  — NO auth required (dev/test).
    //   Forcibly inserts a TEST notification into the database right now,
    //   so you can verify the frontend bell icon works at any time of day.
    // ─────────────────────────────────────────────────────────────────
    @PostMapping("/test-insert")
    public ResponseEntity<?> testInsert() {
        LocalDateTime now = LocalDateTime.now();
        
        announcementRepository.save(
            MealAnnouncement.builder()
                .mealType("TEST_MEAL_" + now.getSecond())
                .title("🛠️ Test Notification!")
                .message("This is a test notification to verify the bell icon is working.")
                .emoji("🚀")
                .createdAt(now)
                .build()
        );

        return ResponseEntity.ok(Map.of(
            "message", "✅ Test notification inserted! Check your frontend."
        ));
    }

    // ─────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────

    /** For logged-in student endpoint (includes DB id for dismiss calls) */
    private Map<String, Object> toMap(Notification n) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", n.getId());
        map.put("mealType", n.getMealType());
        map.put("title", n.getTitle());
        map.put("message", n.getMessage());
        map.put("emoji", n.getEmoji());
        map.put("createdAt", n.getCreatedAt() != null ? n.getCreatedAt().format(FMT) : null);
        map.put("seen", n.isSeen());
        return map;
    }

    /** For public endpoint — uses mealType as identifier (no DB id exposed) */
    private Map<String, Object> toPublicMap(Notification n) {
        Map<String, Object> map = new HashMap<>();
        map.put("mealType", n.getMealType());
        map.put("title", n.getTitle());
        map.put("message", n.getMessage());
        map.put("emoji", n.getEmoji());
        map.put("createdAt", n.getCreatedAt() != null ? n.getCreatedAt().format(FMT) : null);
        return map;
    }
}
