package com.expensetracker.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;
@Document(collection = "expenses")
public class Expense {

    @Id
    private String id;

    private String title;
    private double amount;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate date;
    private String category;
    private String imageUrl;
    private String note;
    private String userId;

    public Expense() {}

    public Expense(String title, double amount, LocalDate date, String category) {
        this.title = title;
        this.amount = amount;
        this.date = date;
        this.category = category;
    }

    // getters and setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String receiptUrl) {
        this.imageUrl = receiptUrl;
    }
    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }



    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

}
