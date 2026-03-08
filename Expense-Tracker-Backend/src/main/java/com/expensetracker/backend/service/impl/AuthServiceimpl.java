
package com.expensetracker.backend.service.impl;

import com.expensetracker.backend.dto.LoginRequest;
import com.expensetracker.backend.dto.SignupRequest;
import com.expensetracker.backend.model.User;
import com.expensetracker.backend.repository.UserRepository;
import com.expensetracker.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
@Service
@RequiredArgsConstructor
public class AuthServiceimpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public String signup(SignupRequest request) {

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return "Passwords do not match";
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already registered";
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setAge(request.getAge());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);
        return "Signup successful";
    }

    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) return "User not found";

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return "Invalid password";
        }

        return "Login successful";
    }

    public PasswordEncoder getPasswordEncoder() {
        return passwordEncoder;
    }

    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
