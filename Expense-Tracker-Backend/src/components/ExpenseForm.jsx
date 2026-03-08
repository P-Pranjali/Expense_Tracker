import React, { useState,  useEffect } from "react";
//import { addExpense , updateExpense} from "../services/api";
import "../styles/ExpenseForm.css";

import { addExpense, updateExpense } from "../services/api";


const ExpenseForm = ({ onExpenseAdded,editingExpense }) => {
  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    date: "",
    category: ""
  });

  const [isOther, setIsOther] = useState(false);
  const [otherCategory, setOtherCategory] = useState("");
const [imageFile, setImageFile] = useState(null);

  // ⭐ CATEGORIES FROM YOUR GOOGLE SHEET (updated)
  const categories = [
    "Bills",
    "Subscriptions",
    "Entertainment",
    "Food",
    "Groceries",
    "Hospital",
    "Shopping",
    "Transport",
    "veggies & fruits",
    "Daily Needs",
    //"Gifts",
    "Other"
  ];

    // ⬅️ Prefill the form when editingExpense changes
  useEffect(() => {
    if (editingExpense) {
      const editCat = editingExpense.category;

      setExpense({
        title: editingExpense.title,
        amount: editingExpense.amount,
        date: editingExpense.date,
        category: categories.includes(editCat) ? editCat : ""
      });

      if (!categories.includes(editCat)) {
        setIsOther(true);
        setOtherCategory(editCat);
      } else {
        setIsOther(editCat === "Other");
        setOtherCategory("");
      }
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle category selection
  
    if (name === "category") {
  setIsOther(value === "Other");
  setExpense({ ...expense, category: value === "Other" ? "" : value });
  return;
}


    // Regular form update
    setExpense({ ...expense, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...expense,
      category: isOther ? otherCategory : expense.category
    };

    if (editingExpense) {
      // UPDATE MODE
await updateExpense(editingExpense.id, payload, imageFile);

    } else {
      // ADD MODE
    await addExpense(payload, imageFile);
    }

    onExpenseAdded();
    setExpense({ title: "", amount: "", date: "", category: "" });
    setOtherCategory("");
    setIsOther(false);
    setImageFile(null);
  };

  return (
   <form onSubmit={handleSubmit} className="expense-form">

  {/* Title */}
  <div className="form-row">
    <label>Expense Title</label>
    <input
      type="text"
      name="title"
      placeholder="e.g., Electricity bill"
      value={expense.title}
      onChange={handleChange}
      required
    />
  </div>

  {/* Amount */}
  <div className="form-row">
    <label>Amount (₹)</label>
  <input
  type="number"
  name="amount"
  placeholder="Enter amount"
  value={expense.amount}
  onChange={(e) => {
    let val = e.target.value;

    // BLOCK minus sign while typing
    if (val.includes("-")) return;

    // BLOCK zero or negative values
    if (Number(val) <= 0) {
      setExpense({ ...expense, amount: "" });
      return;
    }

    setExpense({ ...expense, amount: val });
  }}
  onKeyDown={(e) => {
    if (e.key === "-" || e.key === "e") {
      e.preventDefault(); // block minus + scientific notation
    }
  }}
  required
/>
  </div>

  {/* Date */}
  <div className="form-row">
    <label>Date</label>
    <input
      type="date"
      name="date"
      value={expense.date}
      onChange={handleChange}
      required
    />
  </div>

  {/* Category */}
  <div className="form-row">
    <label>Category</label>
    <select
      name="category"
      value={isOther ? "Other" : expense.category}
      onChange={handleChange}
      required
    >
      <option value="">Select Category</option>
      {categories.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  </div>

  {/* Custom Category */}
  {isOther && (
    <div className="form-row">
      <label>Custom Category</label>
      <input
        type="text"
        placeholder="Enter custom category"
        value={otherCategory}
        onChange={(e) => setOtherCategory(e.target.value)}
        required
      />
    </div>
  )}
  {/* Image Upload */}
<div className="form-row">
  <label>Receipt Image (optional)</label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => setImageFile(e.target.files[0])}
  />
</div>


  {/* Submit */}
  <button type="submit" className="submit-btn">
    {editingExpense ? "Update Expense" : "Add Expense"}
  </button>

</form>


  );
};

export default ExpenseForm;
