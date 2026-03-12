import React, { useState } from "react";
import { signupUser } from "../services/api";
import "../styles/Signup.css";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (form.password !== form.confirmPassword) {
  //     setError("Passwords do not match");
  //     return;
  //   }

  //   try {
  //     const res = await signupUser(form);

  //     if (res.data === "Signup successful") {
  //       setSuccess("Account created successfully!");
  //       setTimeout(() => navigate("/login"), 1500);
  //     } else {
  //       setError(res.data);
  //     }
  //   } catch (err) {
  //     setError("Signup failed. Try again.");
  //   }
  // };

   const handleSubmit = async (e) => {
    e.preventDefault();


    if (loading) return; // ✅ prevent multiple requests

    setError("");
    setSuccess("");


    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
       setLoading(true); // ✅ start loading
      const res = await signupUser(form);

      if (res.data === "Signup successful") {
        setSuccess("Account created successfully!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(res.data);
      }
    } catch (err) {
      setError("Signup failed. Try again.");
    }finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-box" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <div className="name-row">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

      
        {/* ✅ Button disabled during request */}
        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="switch-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
}

export default Signup;
