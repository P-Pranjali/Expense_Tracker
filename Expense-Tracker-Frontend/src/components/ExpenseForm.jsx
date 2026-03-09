import React, { useState, useEffect } from "react";
import { addExpense, updateExpense } from "../services/api";
import "../styles/ExpenseForm.css";

const ExpenseForm = ({ onExpenseAdded, editingExpense }) => {
  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    date: "",
    category: ""
  });

  const [isOther, setIsOther] = useState(false);
  const [otherCategory, setOtherCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);

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
    "Other"
  ];

  // Prefill form when editing
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
  }, [editingExpense, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setIsOther(value === "Other");
      setExpense({ ...expense, category: value === "Other" ? "" : value });
      return;
    }

    setExpense({ ...expense, [name]: value });
  };

  const resetForm = () => {
    setExpense({ title: "", amount: "", date: "", category: "" });
    setOtherCategory("");
    setIsOther(false);
    setImageFile(null);
  };

  // ✅ Fixed handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...expense,
      category: isOther ? otherCategory : expense.category
    };

    try {
      let response;
      if (editingExpense) {
        response = await updateExpense(editingExpense.id, payload, imageFile);
      } else {
        response = await addExpense(payload, imageFile);
      }

      // Notify parent about added/updated expense
      onExpenseAdded(response?.data || null);

      // Reset form
      resetForm();
    } catch (err) {
      console.error("Error adding/updating expense:", err);
    }
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
            if (val.includes("-") || Number(val) <= 0) return;
            setExpense({ ...expense, amount: val });
          }}
          onKeyDown={(e) => {
            if (e.key === "-" || e.key === "e") e.preventDefault();
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
            <option key={c} value={c}>{c}</option>
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