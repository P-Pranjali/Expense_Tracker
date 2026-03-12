package com.expensetracker.backend.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String firstName;
    private String lastName;
    private Integer age;

     @Indexed(unique = true) //Add unique index for email
    private String email;
    private String password;

    // New fields for My Profile
    private String country;
    private String phoneNumber;
    private String address;

    // Cloudinary image URL
    private String profileImageUrl;
}
