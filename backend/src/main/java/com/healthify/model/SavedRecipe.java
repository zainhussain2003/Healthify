package com.healthify.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "saved_recipes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedRecipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    // Stored as JSON string
    @Column(name = "substituted_ingredients", columnDefinition = "jsonb")
    private String substitutedIngredients;

    @Column(name = "rewritten_instructions", columnDefinition = "TEXT")
    private String rewrittenInstructions;

    @Column(name = "slider_intensity", nullable = false)
    private Integer sliderIntensity;

    @Column(name = "mode", nullable = false, length = 10)
    private String mode;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
