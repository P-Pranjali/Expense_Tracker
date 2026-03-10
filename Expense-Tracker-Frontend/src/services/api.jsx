import axios from "axios";

// Backend base URL (correct)
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL + "/api",
});

// Add JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== AUTH ==========
export const signupUser = (userData) =>
  api.post("/auth/signup", userData, {
    headers: { "Content-Type": "application/json" },
  });

export const loginUser = (credentials) =>
  api.post("/auth/login", credentials, {
    headers: { "Content-Type": "application/json" },
  });

// Helper
const getUserId = () => localStorage.getItem("userId");

// ========== EXPENSES ==========
export const getAllExpenses = () => api.get("/expenses/all");

export const getExpenses = () =>
  api.get("/expenses/all", {
    params: { userId: getUserId() },
  });

export const addExpense = (expense, imageFile) => {
  const formData = new FormData();
  expense.userId = getUserId();

  formData.append(
    "expense",
    new Blob([JSON.stringify(expense)], { type: "application/json" })
  );

  if (imageFile) formData.append("image", imageFile);

  return api.post("/expenses", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Delete expense
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

// Update expense
export const updateExpense = (id, expenseData, selectedImageFile) => {
  expenseData.userId = getUserId();
  const formData = new FormData();

  formData.append(
    "expense",
    new Blob([JSON.stringify(expenseData)], { type: "application/json" })
  );

  if (selectedImageFile) formData.append("image", selectedImageFile);

  return api.put(`/expenses/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ========== ENVELOPES ==========
const getUserIdSafe = () => {
  const id = localStorage.getItem("userId");
  if (!id) throw new Error("UserId missing. Login required.");
  return id;
};

export const getEnvelopes = () =>
  api.get("/envelopes/user", { params: { userId: getUserIdSafe() } });

export const createEnvelope = (envelope) =>
  api.post("/envelopes/create", envelope, { params: { userId: getUserIdSafe() } });

export const updateEnvelope = (id, envelope) =>
  api.put(`/envelopes/${id}`, envelope, { params: { userId: getUserIdSafe() } });

export const deleteEnvelope = (id) =>
  api.delete(`/envelopes/${id}`, { params: { userId: getUserIdSafe() } });

// Download yearly PDF
export const downloadYearlyPdf = (year) =>
  api.get(`/expenses/pdf/yearly/${year}`, {
    params: { userId: getUserId() },
    responseType: "blob",
  });

export default api;
