
import React, { useState, useEffect } from "react";
import ExpenseList from "../components/ExpenseList";
import DashboardChart from "../components/DashboardChart";
import ExpenseForm from "../components/ExpenseForm";
import "../styles/DashboardPage.css";
import { getExpenses, deleteExpense } from "../services/api";

function DashboardPage() {
  const [openForm, setOpenForm] = useState(false);
  const [reload, setReload] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const userId = localStorage.getItem("userId");
  const user = JSON.parse(localStorage.getItem("user"));

  const [viewExpense, setViewExpense] = useState(null);

  useEffect(() => {
    getExpenses()
      .then((res) => setExpenses(res.data))
      .catch((err) => console.error(err));
  }, [reload]);

  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const monthlyBudget = 30000;
  const remaining = monthlyBudget - totalSpent;

  const handleExpenseAdded = () => {
    setReload(!reload);
    setOpenForm(false);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setOpenForm(true);
  };

  return (
    <>
      <div className="dashboard-container">
        {user && (
          <div className="welcome-box">
            <h1>Welcome, {user.firstName} 👋</h1>
            <p>Here's the summary of your expenses.</p>
           
          </div>
        )}

        {/* ✅ TOP 2-COLUMN GRID */}
        <div className="top-row">

          {/* LEFT COLUMN */}
          <div className="left-section">
            <h2 className="title">Expense Breakdown</h2>

            {/* Pie Chart */}
            <div className="chart-wrapper">
              <DashboardChart expenses={expenses} />
            </div>

            {/* Summary */}

            {/* <div className="summary-item">
                <span className="label">Total Spent</span>
                <span className="value">₹{totalSpent}</span>
              </div>

              <div className="summary-item">
                <span className="label">Monthly Budget</span>
                <span className="value">₹{monthlyBudget}</span>
              </div>

              <div className="summary-item">
                <span className="label">Remaining</span>
                <span className="value">₹{remaining}</span>
              </div> */}
          </div>


          {/* RIGHT COLUMN */}
          <div className="right-section">
            <div className="right-header">
              <h2 className="title">Expenses</h2>

              <button
                className="add-expense-btn"
                onClick={() => {
                  setEditingExpense(null);
                  setOpenForm(true);
                }}
              >
                + Add Expense
              </button>
            </div>

            <div className="table-container">
              <div className="expense-list-scroll">
                <ExpenseList    expenses={expenses} onEditExpense={handleEditExpense}
                  onViewExpense={(exp) => setViewExpense(exp)}
                   onDelete={(id) => {
    deleteExpense(id).then(() => setReload(!reload)); }}
                  key={reload}/>
              </div>
            </div>
          </div>

        </div> {/* END top-row */}

        {/* BOTTOM FULL-WIDTH YEARLY TABLE */}
      
         {/* BOTTOM FULL-WIDTH YEARLY TABLE */}

  <DashboardChart.YearlyTable expenses={expenses} />

      

      </div>

      {/* POPUP FORM */}
      {openForm && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>{editingExpense ? "Edit Expense" : "Add Expense"}</h3>

            <ExpenseForm
              onExpenseAdded={handleExpenseAdded}
              editingExpense={editingExpense}
            />

            <button
              className="close-btn"
              onClick={() => {
                setOpenForm(false);
                setEditingExpense(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {viewExpense && (
        <div className="popup-overlay">
          <div className="popup-box view-box">
            <h3>Expense Details</h3>

            <p><strong>Title:</strong> {viewExpense.title}</p>
            <p><strong>Category:</strong> {viewExpense.category}</p>
            <p><strong>Amount:</strong> ₹{viewExpense.amount}</p>
            <p><strong>Date:</strong> {new Date(viewExpense.date).toLocaleDateString()}</p>

            {viewExpense.imageUrl ? (
              <img
                src={viewExpense.imageUrl}
                alt="Receipt"
                style={{ width: "100%", borderRadius: "10px", marginTop: "10px" }}
              />
            ) : (
              <p>No receipt uploaded</p>
            )}

            <button className="close-btn" onClick={() => setViewExpense(null)}>
              Close
            </button>
          </div>
        </div>
      )}

    </>
  );
}

export default DashboardPage;
