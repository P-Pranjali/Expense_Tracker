package com.expensetracker.backend.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageUploadService {

    /**
     * Uploads an image to Cloudinary and returns the URL.
     *
     * @param file the image file to upload
     * @return the secure URL of the uploaded image
     * @throws IOException if an error occurs during file upload
     */
    String uploadImage(MultipartFile file) throws IOException;
}