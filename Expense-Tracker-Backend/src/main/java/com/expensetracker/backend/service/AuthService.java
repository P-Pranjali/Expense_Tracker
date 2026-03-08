package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.LoginRequest;
import com.expensetracker.backend.dto.SignupRequest;
import org.springframework.security.crypto.password.PasswordEncoder;

public interface AuthService {

    String signup(SignupRequest request);

    String login(LoginRequest request);

    PasswordEncoder getPasswordEncoder();

    boolean validatePassword(String rawPassword, String encodedPassword);
}