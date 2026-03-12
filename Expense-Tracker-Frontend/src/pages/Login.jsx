import React, { useState } from "react";
import { loginUser } from "../services/api";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
   const [loading, setLoading] = useState(false); //Added loading state

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); //Start loading

    try {
      const res = await loginUser(form);

      if (!res.data.token) {
        setError("Invalid credentials");
        return;
      }

      // Save token + user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

         // ⭐ IMPORTANT — Save userId separately
     localStorage.setItem("userId", res.data.user.id);


      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Check your credentials.");
    } finally {
      setLoading(false); //Stop loading
    }
  };

  return (
    <div className="login-container">

      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {error && <p className="error">{error}</p>}

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

       
        {/* ✅ Updated button with loading */}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>


        <p className="switch-text">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign Up</span>
        </p>
      </form>
    </div>
  );
}

export default Login;
