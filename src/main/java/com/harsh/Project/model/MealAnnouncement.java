package com.harsh.Project.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Global meal announcement created by the cron scheduler.
 * NOT tied to any specific student — used for the public notification endpoint
 * so ALL website visitors (logged in or not) can see today's meal alerts.
 */
@Entity
@Table(name = "meal_announcements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealAnnouncement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** e.g. BREAKFAST, LUNCH, SNACKS, DINNER */
    @Column(nullable = false, length = 20)
    private String mealType;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String message;

    @Column(length = 10)
    private String emoji;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
