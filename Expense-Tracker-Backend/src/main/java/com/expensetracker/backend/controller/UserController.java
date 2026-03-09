package com.expensetracker.backend.controller;

import com.expensetracker.backend.config.JwtUtil;
import com.expensetracker.backend.entity.User;
import com.expensetracker.backend.repository.UserRepository;
import com.expensetracker.backend.service.impl.ImageUploadServiceimpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final ImageUploadServiceimpl imageUploadService;

    // ---------------------------------------------------
    // GET Profile of Logged-in User
    // ---------------------------------------------------
    @GetMapping("/me")
    public ResponseEntity<?> getProfile(Principal principal) {
        String email = principal.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        return ResponseEntity.ok(userOpt.get());
    }

    // ---------------------------------------------------
    // UPDATE Profile (Except Email & Password)
    // ---------------------------------------------------
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedUser, Principal principal) {

        String email = principal.getName();
        Optional<User> existingUserOpt = userRepository.findByEmail(email);

        if (existingUserOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = existingUserOpt.get();

        // Update allowed fields only
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setAge(updatedUser.getAge());
        user.setCountry(updatedUser.getCountry());
        user.setPhoneNumber(updatedUser.getPhoneNumber());
        user.setAddress(updatedUser.getAddress());

        // DO NOT update email or password here
        // ⭐ IMPORTANT FIX: Update image in profile
        user.setProfileImageUrl(updatedUser.getProfileImageUrl());
        userRepository.save(user);

        return ResponseEntity.ok("Profile updated successfully");
    }

    // ---------------------------------------------------
    // Upload Profile Image → Cloudinary
    // ---------------------------------------------------
    @PostMapping("/upload-profile-image")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("file") MultipartFile file,
                                                Principal principal) {

        try {
            String email = principal.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);

            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            User user = userOpt.get();

            // Upload image to Cloudinary
            String imageUrl = imageUploadService.uploadImage(file);

            user.setProfileImageUrl(imageUrl);
            userRepository.save(user);

            return ResponseEntity.ok(imageUrl);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Image upload failed");
        }
    }
}
