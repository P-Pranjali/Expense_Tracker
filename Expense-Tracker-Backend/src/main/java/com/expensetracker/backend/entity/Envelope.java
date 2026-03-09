package com.expensetracker.backend.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "envelopes")
public class Envelope {

    @Id
    private String id;

    private String name;          // example: "Groceries", "Bills"
    private double budget;        // example: 5000
    private String userId;        // owner of this envelope


    private double spent = 0.0;  // <-- ADD THIS
    private String color;         // optional UI color for mobile app
    private String icon;          // optional icon name

    private String createdAt;
    private String updatedAt;
}
