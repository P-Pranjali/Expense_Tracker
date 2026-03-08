import api from "./api"; // your axios instance

// Get logged-in user's profile
export const getProfile = () => api.get("/user/me");

// Update profile fields
export const updateProfile = (data) => api.put("/user/update", data);

// Upload profile picture
export const uploadProfileImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/user/upload-profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
