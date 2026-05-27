package com.harsh.Project.Repository;

import com.harsh.Project.model.MealAnnouncement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MealAnnouncementRepository extends JpaRepository<MealAnnouncement, Long> {

    /** Today's global meal announcements, ordered by meal time */
    List<MealAnnouncement> findByCreatedAtBetweenOrderByCreatedAtAsc(
            LocalDateTime start, LocalDateTime end);

    /** Check if this meal was already announced today (prevent duplicates on restart) */
    @Query("SELECT COUNT(m) > 0 FROM MealAnnouncement m " +
           "WHERE m.mealType = :mealType " +
           "AND m.createdAt >= :startOfDay " +
           "AND m.createdAt < :endOfDay")
    boolean existsTodayAnnouncement(String mealType,
                                    LocalDateTime startOfDay,
                                    LocalDateTime endOfDay);
}
