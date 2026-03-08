package com.expensetracker.backend.controller;

import com.expensetracker.backend.config.JwtUtil;
import com.expensetracker.backend.dto.LoginRequest;
import com.expensetracker.backend.dto.SignupRequest;
import com.expensetracker.backend.model.User;
import com.expensetracker.backend.repository.UserRepository;
import com.expensetracker.backend.service.impl.AuthServiceimpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthServiceimpl authService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        String result = authService.signup(request);
        if (result.equals("Signup successful")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().body(result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        // Validate password
        if (!authService.validatePassword(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid password");
        }


        // Generate token
        String token = jwtUtil.generateToken(user.getEmail(), user.getId());

        // Return JSON object
        return ResponseEntity.ok(
                Map.of(
                        "token", token,
                        "user", user
                )
        );
    }
}
