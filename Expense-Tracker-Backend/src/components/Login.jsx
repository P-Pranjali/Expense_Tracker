// import { useState } from "react";
// import { loginUser } from "../services/api";

// const Login = () => {
//   const [form, setForm] = useState({ email: "", password: "" });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await loginUser(form);
//       const token = response.data;
// const user = response.data.user;
//       localStorage.setItem("token", token);
// localStorage.setItem("user", JSON.stringify(user));  // ← save user
//       alert("Login successful");
//     } catch (error) {
//       alert("Login failed: " + error.response.data);
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input name="email" placeholder="Email" onChange={handleChange} />
//         <input name="password" type="password" placeholder="Password" onChange={handleChange} />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;
