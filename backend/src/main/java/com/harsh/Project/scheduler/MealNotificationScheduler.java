package com.harsh.Project.scheduler;

import com.harsh.Project.Repository.MealAnnouncementRepository;
import com.harsh.Project.Repository.NotificationRepository;
import com.harsh.Project.Repository.StudentRepository;
import com.harsh.Project.model.MealAnnouncement;
import com.harsh.Project.model.Notification;
import com.harsh.Project.model.Student;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * Sends meal-time notifications using Spring's @Scheduled cron (IST — Asia/Kolkata).
 *
 * Each meal does TWO things:
 *   1. Saves a global MealAnnouncement (powers the public endpoint — no students needed)
 *   2. Saves per-student Notification rows (powers the authenticated dismiss-tracking endpoint)
 *
 * Meal schedule:
 *   Breakfast  → 7:30 AM  (cron: 0 30 7  * * *)
 *   Lunch      → 12:30 PM (cron: 0 30 12 * * *)
 *   Snacks     → 4:30 PM  (cron: 0 30 16 * * *)
 *   Dinner     → 8:00 PM  (cron: 0 0  20 * * *)
 */
@Component
public class MealNotificationScheduler {

    private static final Logger log = LoggerFactory.getLogger(MealNotificationScheduler.class);

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private MealAnnouncementRepository announcementRepository;

    // ─────────────────────────────────────────────────────────────────
    // BREAKFAST  — 7:30 AM every day
    // ─────────────────────────────────────────────────────────────────
    @Scheduled(cron = "0 30 7 * * *", zone = "Asia/Kolkata")
    @Transactional
    public void sendBreakfastNotification() {
        trigger("BREAKFAST",
                "🌅 Breakfast is ready!",
                "Head to the mess — Breakfast is being served now. (7:30 AM – 9:30 AM)",
                "🍳");
    }

    // ─────────────────────────────────────────────────────────────────
    // LUNCH  — 12:30 PM every day
    // ─────────────────────────────────────────────────────────────────
    @Scheduled(cron = "0 30 12 * * *", zone = "Asia/Kolkata")
    @Transactional
    public void sendLunchNotification() {
        trigger("LUNCH",
                "☀️ Lunch is ready!",
                "It's lunchtime — come enjoy your meal at the mess. (12:30 PM – 2:30 PM)",
                "🍛");
    }

    // ─────────────────────────────────────────────────────────────────
    // SNACKS  — 4:30 PM every day
    // ─────────────────────────────────────────────────────────────────
    @Scheduled(cron = "0 30 16 * * *", zone = "Asia/Kolkata")
    @Transactional
    public void sendSnacksNotification() {
        trigger("SNACKS",
                "🍵 Snacks are being served!",
                "Evening snacks are available at the mess counter. (4:30 PM – 6:00 PM)",
                "🥪");
    }

    // ─────────────────────────────────────────────────────────────────
    // DINNER  — 8:00 PM every day
    // ─────────────────────────────────────────────────────────────────
    @Scheduled(cron = "0 0 20 * * *", zone = "Asia/Kolkata")
    @Transactional
    public void sendDinnerNotification() {
        trigger("DINNER",
                "🌙 Dinner is ready!",
                "Dinner is being served — come to the mess. (8:00 PM – 10:00 PM)",
                "🍲");
    }

    // ─────────────────────────────────────────────────────────────────
    // Core trigger: runs for every meal
    // ─────────────────────────────────────────────────────────────────
    private void trigger(String mealType, String title, String message, String emoji) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay   = LocalDate.now().atTime(LocalTime.MAX);
        LocalDateTime now        = LocalDateTime.now();

        // ── Step 1: Global announcement (works even with 0 students) ──
        boolean alreadyAnnounced = announcementRepository
                .existsTodayAnnouncement(mealType, startOfDay, endOfDay);

        if (!alreadyAnnounced) {
            announcementRepository.save(
                MealAnnouncement.builder()
                    .mealType(mealType)
                    .title(title)
                    .message(message)
                    .emoji(emoji)
                    .createdAt(now)
                    .build()
            );
            log.info("[Scheduler] Global {} announcement saved", mealType);
        } else {
            log.info("[Scheduler] {} announcement already exists for today — skipped", mealType);
        }

        // ── Step 2: Per-student notifications (for dismiss tracking) ──
        List<Student> students = studentRepository.findAll();
        int sent = 0;
        for (Student student : students) {
            boolean alreadySent = notificationRepository.existsTodayNotification(
                    student, mealType, startOfDay, endOfDay);
            if (alreadySent) continue;

            notificationRepository.save(
                Notification.builder()
                    .student(student)
                    .mealType(mealType)
                    .title(title)
                    .message(message)
                    .emoji(emoji)
                    .createdAt(now)
                    .seen(false)
                    .build()
            );
            sent++;
        }
        log.info("[Scheduler] {} per-student notifications sent to {} student(s)", mealType, sent);
    }
}
