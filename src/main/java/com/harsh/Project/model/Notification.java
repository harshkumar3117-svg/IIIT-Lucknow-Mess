package com.harsh.Project.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The student this notification belongs to */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    /** Meal type: BREAKFAST, LUNCH, SNACKS, DINNER */
    @Column(nullable = false, length = 20)
    private String mealType;

    /** Human-readable title shown in the bell dropdown */
    @Column(nullable = false)
    private String title;

    /** Descriptive body message */
    @Column(nullable = false)
    private String message;

    /** Emoji icon for the notification */
    @Column(length = 10)
    private String emoji;

    /** When the cron job created this notification */
    @Column(nullable = false)
    private LocalDateTime createdAt;

    /** Whether the student has dismissed/seen it */
    @Column(nullable = false)
    private boolean seen;
}
