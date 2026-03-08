package com.expensetracker.backend.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String firstName;
    private String lastName;
    private Integer age;

    private String email;
    private String password;
    private String confirmPassword;
}
