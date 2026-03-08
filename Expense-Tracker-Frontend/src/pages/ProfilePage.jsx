import React, { useState, useEffect } from "react";
import "../styles/ProfilePage.css";
import Swal from "sweetalert2";

import { getProfile, updateProfile, uploadProfileImage } from "../services/userApi";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    age: "",
    country: "",
    phoneNumber: "",
    address: "",
    email: "",
    profileImageUrl: "",
  });

  const [originalProfile, setOriginalProfile] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Load profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();

        const user = {
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          age: res.data.age || "",
          country: res.data.country || "",
          phoneNumber: res.data.phoneNumber || "",
          address: res.data.address || "",
          email: res.data.email || "",
          profileImageUrl: res.data.profileImageUrl || "",
        };

        setProfile(user);
        setOriginalProfile(user);
      } catch (error) {
        console.error("Error loading profile", error);
      }
    };

    fetchProfile();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Upload image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const res = await uploadProfileImage(file);
      const imageUrl = res.data;

      setProfile((prev) => ({
        ...prev,
        profileImageUrl: imageUrl,
      }));
    } catch (error) {
      console.error("Image upload error:", error);
    }

    setLoading(false);
  };

  // Save updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(profile);
     Swal.fire({
  icon: "success",
  title: "Profile Updated!",
  text: "Your profile has been updated successfully.",
  showConfirmButton: false,
  timer: 1500
});


      setOriginalProfile(profile);  
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
        Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: "Something went wrong. Please try again.",
    });
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setProfile(originalProfile); 
    setIsEditing(false);
  };

  return (
    <div className={`profile-container ${isEditing ? "editing" : ""}`}>
      <div className="profile-card">

        <div className="profile-header">
          <div className="profile-image-wrapper">
            <div className="profile-image empty-profile">
              {profile.profileImageUrl ? (
                <img src={profile.profileImageUrl} alt="Profile" className="profile-image" />
              ) : (
                <div className="empty-placeholder">+</div>
              )}
            </div>

            {isEditing && (
              <label className="upload-btn">
                {loading ? "Uploading..." : "Upload"}
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              </label>
            )}
          </div>

          <h2>My Profile</h2>
          <p className="subtitle">Manage your personal information</p>

          {!isEditing && (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="grid-2">

            <div className="form-group">
              <label>First Name</label>
              <input
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                name="country"
                value={profile.country}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Phone No.</label>
              <input
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Email (Read Only)</label>
              <input value={profile.email} readOnly />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                name="address"
                value={profile.address}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

          </div>

          {isEditing && (
            <div className="button-row">
              <button className="save-btn" type="submit">Save</button>
              <button className="cancel-btn" type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          )}

        </form>

      </div>
    </div>
  );
};

export default ProfilePage;
