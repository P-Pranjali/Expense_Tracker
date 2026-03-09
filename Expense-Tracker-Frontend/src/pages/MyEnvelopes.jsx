// import React, { useEffect, useState } from "react";
// import { getEnvelopes, createEnvelope, updateEnvelope, deleteEnvelope } from "../services/api";
// import "../styles/MyEnvelopes.css";

// function MyEnvelopes() {
//   const [envelopes, setEnvelopes] = useState([]);
//   const [reload, setReload] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "Bills",
//     budget: 0,
//     color: "#AEC6CF", // default pastel
//     icon: "",
//   });

//   // Dropdown options
//   const envelopeCategories =  [ "Bills",
//     "Subscriptions",
//     "Entertainment",
//     "Food",
//     "Groceries",
//     "Hospital",
//     "Shopping",
//     "Transport",
//     "veggies & fruits",
//     "Daily Needs",
//     //"Gifts",
//     "Other"];
//   const colorOptions = [
//     { name: "Pastel Blue", value: "#AEC6CF" },
//     { name: "Pastel Pink", value: "#FFD1DC" },
//     { name: "Pastel Green", value: "#DFFFD6" },
//     { name: "Pastel Yellow", value: "#FFFACD" },
//     { name: "Pastel Purple", value: "#E8D7FF" },
//     { name: "Pastel Orange", value: "#FFE5B4" },
//   ];

//   // Fetch envelopes
//   const fetchEnvelopes = () => {
//     getEnvelopes()
//       .then(res => setEnvelopes(res.data))
//       .catch(err => console.error(err));
//   };

//   useEffect(() => {
//     fetchEnvelopes();
//   }, [reload]);

//   const resetForm = () => setFormData({ name: "Bills", budget: 0, color: "#AEC6CF", icon: "" });

// const handleSubmit = (e) => {
//   e.preventDefault();
//   const userId = localStorage.getItem("userId"); // fetch logged in userId

//   const payload = {
//     name: formData.name,
//     budget: formData.budget,
//     color: formData.color,
//     icon: formData.icon,
//   };

//   if (editing) {
//     updateEnvelope(editing.id, payload, userId)
//       .then(() => {
//         setReload(!reload);
//         setEditing(null);
//         resetForm();
//       })
//       .catch(err => console.error(err));
//   } else {
//     createEnvelope(payload, userId)
//       .then(() => {
//         setReload(!reload);
//         resetForm();
//       })
//       .catch(err => console.error(err));
//   }
// };

//   const handleEdit = (env) => {
//     setEditing(env);
//     setFormData({
//       name: env.name,
//       budget: env.budget,
//       color: env.color || "#AEC6CF",
//       icon: env.icon || "",
//     });
//   };

//   const handleDelete = (id) => {
//     deleteEnvelope(id)
//       .then(() => setReload(!reload))
//       .catch(err => console.error(err));
//   };

//   return (
//     <div className="envelopes-container">
//       <h2>My Envelopes</h2>

//       {/* Envelope Form */}
//       <form className="envelope-form" onSubmit={handleSubmit}>
//         {/* Name Dropdown */}
//         <select
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           required
//         >
//           {envelopeCategories.map((cat) => (
//             <option key={cat} value={cat}>{cat}</option>
//           ))}
//         </select>

//         {/* Budget Input */}
//         <input
//           type="number"
//           placeholder="Budget"
//           value={formData.budget}
//           onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
//           required
//         />

//         {/* Color Dropdown */}
//         <select
//           value={formData.color}
//           onChange={(e) => setFormData({ ...formData, color: e.target.value })}
//         >
//           {colorOptions.map((c) => (
//             <option key={c.value} value={c.value}>{c.name}</option>
//           ))}
//         </select>

//         {/* Icon Input */}
//         <input
//           type="text"
//           placeholder="Icon (optional)"
//           value={formData.icon}
//           onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
//         />

//         <button type="submit">{editing ? "Update" : "Add"} Envelope</button>
//         {editing && <button type="button" onClick={() => { setEditing(null); resetForm(); }}>Cancel</button>}
//       </form>

//       {/* Envelope Cards */}
//       <div className="envelopes-list">
//         {envelopes.map((env) => (
//           <div
//             className="envelope-card"
//             key={env.id}
//             style={{
//               borderColor: env.color,
//               backgroundColor: env.color,
//               color: "#000",
//             }}
//           >
//             <h3>{env.icon ? `${env.icon} ` : ""}{env.name}</h3>
//             <p><strong>Budget:</strong> ₹{env.budget}</p>
//             <p><strong>Spent:</strong> ₹{env.spent}</p>
//             <p><strong>Remaining:</strong> ₹{(env.budget - env.spent).toFixed(2)}</p>
//             <p><strong>Created At:</strong> {env.createdAt ? new Date(env.createdAt).toLocaleString() : "-"}</p>
//             <p><strong>Updated At:</strong> {env.updatedAt ? new Date(env.updatedAt).toLocaleString() : "-"}</p>
//             <div className="envelope-actions">
//               <button onClick={() => handleEdit(env)}>Edit</button>
//               <button onClick={() => handleDelete(env.id)}>Delete</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default MyEnvelopes;

import React, { useEffect, useState } from "react";
import { 
  getEnvelopes, 
  createEnvelope, 
  updateEnvelope, 
  deleteEnvelope, 
  getExpenses 
} from "../services/api";
import "../styles/MyEnvelopes.css";

function MyEnvelopes() {
  const [envelopes, setEnvelopes] = useState([]);
  const [reload, setReload] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "Bills",
    budget: 0,
    color: "#AEC6CF",
    icon: "",
  });

  // Dropdown options
  const envelopeCategories = [
    "Bills", "Subscriptions", "Entertainment", "Food", "Groceries",
    "Hospital", "Shopping", "Transport", "veggies & fruits",
    "Daily Needs", "Other"
  ];

  const colorOptions = [
    { name: "Pastel Blue", value: "#AEC6CF" },
    { name: "Pastel Pink", value: "#FFD1DC" },
    { name: "Pastel Green", value: "#DFFFD6" },
    { name: "Pastel Yellow", value: "#FFFACD" },
    { name: "Pastel Purple", value: "#E8D7FF" },
    { name: "Pastel Orange", value: "#FFE5B4" },
  ];

  // Fetch envelopes and calculate spent dynamically
  const fetchEnvelopes = async () => {
    try {
      const resEnvelopes = await getEnvelopes();
      const resExpenses = await getExpenses(); // fetch all expenses

      const expenses = resExpenses.data;

      const updatedEnvelopes = resEnvelopes.data.map((env) => {
        const spent = expenses
          .filter(exp => exp.category === env.name) // match envelope name
          .reduce((sum, exp) => sum + Number(exp.amount), 0);

        return {
          ...env,
          spent
        };
      });

      setEnvelopes(updatedEnvelopes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEnvelopes();
  }, [reload]);

  const resetForm = () => setFormData({ name: "Bills", budget: 0, color: "#AEC6CF", icon: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    const payload = {
      name: formData.name,
      budget: formData.budget,
      color: formData.color,
      icon: formData.icon,
    };

    if (editing) {
      updateEnvelope(editing.id, payload, userId)
        .then(() => {
          setReload(!reload);  // triggers fetchEnvelopes and recalculation
          setEditing(null);
          resetForm();
        })
        .catch(err => console.error(err));
    } else {
      createEnvelope(payload, userId)
        .then(() => {
          setReload(!reload);  // triggers fetchEnvelopes and recalculation
          resetForm();
        })
        .catch(err => console.error(err));
    }
  };

  const handleEdit = (env) => {
    setEditing(env);
    setFormData({
      name: env.name,
      budget: env.budget,
      color: env.color || "#AEC6CF",
      icon: env.icon || "",
    });
  };

  const handleDelete = (id) => {
    deleteEnvelope(id)
      .then(() => setReload(!reload))  // triggers fetchEnvelopes and recalculation
      .catch(err => console.error(err));
  };

  return (
    <div className="envelopes-container">
      <h2>My Envelopes</h2>

      {/* Envelope Form */}
      <form className="envelope-form" onSubmit={handleSubmit}>
        <select
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        >
          {envelopeCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Budget"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
          required
        />

        <select
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
        >
          {colorOptions.map((c) => (
            <option key={c.value} value={c.value}>{c.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Icon (optional)"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
        />

        <button type="submit">{editing ? "Update" : "Add"} Envelope</button>
        {editing && <button type="button" onClick={() => { setEditing(null); resetForm(); }}>Cancel</button>}
      </form>

      {/* Envelope Cards */}
      <div className="envelopes-list">
        {envelopes.map((env) => (
          <div
            className="envelope-card"
            key={env.id}
            style={{ borderColor: env.color, backgroundColor: env.color, color: "#000" }}
          >
            <h3>{env.icon ? `${env.icon} ` : ""}{env.name}</h3>
            <p><strong>Budget:</strong> ₹{env.budget}</p>
            <p><strong>Spent:</strong> ₹{env.spent}</p>
            <p><strong>Remaining:</strong> ₹{(env.budget - env.spent).toFixed(2)}</p>
            <p><strong>Created At:</strong> {env.createdAt ? new Date(env.createdAt).toLocaleString() : "-"}</p>
            <p><strong>Updated At:</strong> {env.updatedAt ? new Date(env.updatedAt).toLocaleString() : "-"}</p>
            <div className="envelope-actions">
              <button onClick={() => handleEdit(env)}>Edit</button>
              <button onClick={() => handleDelete(env.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyEnvelopes;