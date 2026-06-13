package com.harsh.Project.Repository;

import com.harsh.Project.model.MealAnnouncement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MealAnnouncementRepository extends JpaRepository<MealAnnouncement, Long> {

    List<MealAnnouncement> findByCreatedAtBetweenOrderByCreatedAtAsc(
            LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT(m) > 0 FROM MealAnnouncement m " +
           "WHERE m.mealType = :mealType " +
           "AND m.createdAt >= :startOfDay " +
           "AND m.createdAt < :endOfDay")
    boolean existsTodayAnnouncement(String mealType,
                                    LocalDateTime startOfDay,
                                    LocalDateTime endOfDay);
}
