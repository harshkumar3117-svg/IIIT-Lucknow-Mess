package com.harsh.Project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${feedback.to.email}")
    private String toEmail;

    @PostMapping
    public ResponseEntity<Map<String, String>> submitFeedback(@RequestBody FeedbackRequest req) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("🍽️ New Mess Feedback Received");
            message.setText(buildEmailBody(req));

            mailSender.send(message);
            return ResponseEntity.ok(Map.of("message", "Feedback submitted successfully!"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to send feedback: " + e.getMessage()));
        }
    }

    private String buildEmailBody(FeedbackRequest req) {
        StringBuilder sb = new StringBuilder();
        sb.append("📋 IIIT Lucknow Mess — New Feedback\n");
        sb.append("═══════════════════════════════════\n\n");

        if (req.getRating() > 0) {
            sb.append("⭐ Rating: ").append("★".repeat(req.getRating()))
              .append(" (").append(req.getRating()).append("/5)\n");
        }
        if (req.getMenuGood() != null) {
            sb.append("📋 Menu Good? ").append("yes".equals(req.getMenuGood()) ? "👍 Yes" : "👎 No").append("\n");
        }
        if (req.getMood() != null) {
            sb.append("😊 Mood: ").append(req.getMood()).append("\n");
        }
        if (req.getDiet() != null) {
            sb.append("🥗 Diet Preference: ").append(req.getDiet()).append("\n");
        }
        if (req.getHealthIssues() != null && !req.getHealthIssues().isEmpty()) {
            sb.append("🏥 Health Issues: ").append(String.join(", ", req.getHealthIssues())).append("\n");
        }
        if (req.getOtherHealthIssue() != null && !req.getOtherHealthIssue().isBlank()) {
            sb.append("📝 Other Health Issue: ").append(req.getOtherHealthIssue()).append("\n");
        }
        if (req.getSuggestedDish() != null && !req.getSuggestedDish().isBlank()) {
            sb.append("🍛 Suggested Dish: ").append(req.getSuggestedDish()).append("\n");
        }
        if (req.getComments() != null && !req.getComments().isBlank()) {
            sb.append("\n💬 Additional Comments:\n").append(req.getComments()).append("\n");
        }

        sb.append("\n═══════════════════════════════════\n");
        sb.append("Sent via MessEase Feedback System");
        return sb.toString();
    }

    // ──── Inner DTO ────
    public static class FeedbackRequest {
        private int rating;
        private String menuGood;
        private String mood;
        private String diet;
        private List<String> healthIssues;
        private String otherHealthIssue;
        private String suggestedDish;
        private String comments;

        public int getRating() { return rating; }
        public void setRating(int rating) { this.rating = rating; }

        public String getMenuGood() { return menuGood; }
        public void setMenuGood(String menuGood) { this.menuGood = menuGood; }

        public String getMood() { return mood; }
        public void setMood(String mood) { this.mood = mood; }

        public String getDiet() { return diet; }
        public void setDiet(String diet) { this.diet = diet; }

        public List<String> getHealthIssues() { return healthIssues; }
        public void setHealthIssues(List<String> healthIssues) { this.healthIssues = healthIssues; }

        public String getOtherHealthIssue() { return otherHealthIssue; }
        public void setOtherHealthIssue(String otherHealthIssue) { this.otherHealthIssue = otherHealthIssue; }

        public String getSuggestedDish() { return suggestedDish; }
        public void setSuggestedDish(String suggestedDish) { this.suggestedDish = suggestedDish; }

        public String getComments() { return comments; }
        public void setComments(String comments) { this.comments = comments; }
    }
}
