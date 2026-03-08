import React, { useEffect, useState } from "react";
import { getExpenses, deleteExpense } from "../services/api";
import "../styles/ExpenseList.css";
const ExpenseList = ({ expenses=[], onEditExpense, onViewExpense , onDelete}) => {
 // const [expenses, setExpenses] = useState([]);



  return (
    <div className="expense-list-container">
      <h3 className="expense-list-title">Recent Expenses</h3>
      <div className="expense-list-scroll"></div>
      <div className="expense-table">
        {/* TABLE HEADER */}
        <div className="expense-row header">
          <div>Category</div>
          <div>Name</div>
          <div>Date</div>
          <div>Category Type</div>
          <div className="amount-header">Amount</div>
          <div className="actions-header">Actions</div>
        </div>

        {/* TABLE BODY */}
        {expenses
          .sort((a, b) => new Date(b.date) - new Date(a.date))  // latest first
          .slice(0, 6)                                           // show only 6
          .map((exp) => (
            <div className="expense-row" key={exp.id}>
              <div className="category-icon">
                {/* TEMP ICON — will replace with icons later */}
                <span className="icon-circle">{exp.category[0]}</span>
              </div>

              <div className="title-lable">{exp.title}</div>

              <div>
                {new Date(exp.date).toLocaleDateString("en-IN")}
              </div>

              <div className="category-label">{exp.category}</div>

              <div className="amount">₹{exp.amount}</div>

              {/* ACTION BUTTONS */}
              <div className="actions">

                {/* VIEW */}
                <button className="icon-btn" data-tooltip="View" onClick={() => onViewExpense(exp)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>

                {/* EDIT */}
                <button className="icon-btn" data-tooltip="Edit" onClick={() => onEditExpense(exp)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5l4 4L7 21H3v-4z"></path>
                  </svg>
                </button>

                {/* DELETE */}
                <button className="icon-btn danger" data-tooltip="Delete" onClick={() => onDelete(exp.id)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6l-1 14H6L5 6"></path>
                    <path d="M10 11v6"></path>
                    <path d="M14 11v6"></path>
                    <path d="M9 6V4h6v2"></path>
                  </svg>
                </button>

              </div>

            </div>
          ))}
      </div>
    </div>

  );
};
export default ExpenseList;
