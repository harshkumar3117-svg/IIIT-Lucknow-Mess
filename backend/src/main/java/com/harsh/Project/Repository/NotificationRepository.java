package com.harsh.Project.Repository;

import com.harsh.Project.model.Notification;
import com.harsh.Project.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByStudentAndSeenFalseOrderByCreatedAtDesc(Student student);

    List<Notification> findByStudentOrderByCreatedAtDesc(Student student);

    @Query("SELECT COUNT(n) > 0 FROM Notification n " +
           "WHERE n.student = :student " +
           "AND n.mealType = :mealType " +
           "AND n.createdAt >= :startOfDay " +
           "AND n.createdAt < :endOfDay")
    boolean existsTodayNotification(Student student,
                                    String mealType,
                                    LocalDateTime startOfDay,
                                    LocalDateTime endOfDay);


    @Query("SELECT DISTINCT n FROM Notification n " +
           "WHERE n.createdAt >= :startOfDay " +
           "AND n.createdAt < :endOfDay " +
           "GROUP BY n.mealType, n.title, n.message, n.emoji, n.createdAt, n.id " +
           "ORDER BY n.createdAt ASC")
    List<Notification> findDistinctMealsForToday(LocalDateTime startOfDay,
                                                  LocalDateTime endOfDay);

    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.seen = true WHERE n.student = :student AND n.seen = false")
    void markAllSeenForStudent(Student student);
}
