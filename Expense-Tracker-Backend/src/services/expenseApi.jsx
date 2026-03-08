// src/services/expenseApi.js
import api from "./api";

// Get expenses for current month
export const getCurrentMonthExpenses = () => api.get("/expenses/current-month");

// Get expenses for a specific month & year
export const getExpensesByMonth = (year, month) =>
  api.get(`/expenses/month/${year}/${month}`);

// Get expenses for a specific year
export const getExpensesByYear = (year) => api.get(`/expenses/year/${year}`);

// ===== New / updated API calls =====

// Paginated fetch (page: 0-based, size: items per page)
export const getExpensesPaginated = (page = 0, size = 20) =>
  api.get(`/expenses/paginated?page=${page}&size=${size}`);

// Date-range fetch: start/end should be 'YYYY-MM-DD'
export const getExpensesByDateRange = (start, end) =>
  api.get(`/expenses/range?start=${start}&end=${end}`);

// Delete expense
export const deleteExpenseById = (id) => api.delete(`/expenses/${id}`);

// Update expense (no image) - backend update expects multipart; if you have an image use updateExpenseWithImage from api.js
export const updateExpense = (id, expenseData) =>
  // try JSON PUT first; if backend expects multipart, use updateExpenseWithImage instead
  api.put(`/expenses/${id}`, expenseData).catch(() => {
    // fallback to multipart via the updateExpenseWithImage util if plain JSON fails
    // updateExpenseWithImage is defined in src/services/api.js
    const { updateExpenseWithImage } = require("./api");
    return updateExpenseWithImage(id, expenseData, null);
  });
