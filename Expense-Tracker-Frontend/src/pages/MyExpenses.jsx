// src/pages/MyExpenses.jsx
import React, { useEffect, useState } from "react";
import {
  getCurrentMonthExpenses,
  getExpensesByMonth,
  getExpensesByYear,
  getExpensesPaginated,
  getExpensesByDateRange,
  deleteExpenseById,
  updateExpense,
} from "../services/expenseApi";
import "../styles/MyExpenses.css";

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function groupByDay(expenses) {
  // expects expense.date as ISO date string or something parseable by Date
  const map = {};
  expenses.forEach((e) => {
    const d = e.date ? e.date.slice(0,10) : "unknown"; // "YYYY-MM-DD"
    if (!map[d]) map[d] = [];
    map[d].push(e);
  });
  // return sorted array by date desc
  return Object.keys(map)
    .sort((a,b) => (a < b ? 1 : -1))
    .map((date) => ({ date, items: map[date] }));
}

const MyExpenses = () => {
  const today = new Date();
  const [yearOptions, setYearOptions] = useState([]);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // 1-12

  // pagination state
  const [page, setPage] = useState(0);
  const [size] = useState(10); // items per page; adjust as you like
  const [totalPages, setTotalPages] = useState(0);

  const [expenses, setExpenses] = useState([]);
  const [grouped, setGrouped] = useState([]); // grouped by day
  const [groupByDayMode, setGroupByDayMode] = useState(false);

  const [loading, setLoading] = useState(false);

  // date-range picker state
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  // editing state
  const [editingExpense, setEditingExpense] = useState(null);
const [viewExpense, setViewExpense] = useState(null);

  // prepare year options (current year and 4 previous)
  useEffect(() => {
    const y = today.getFullYear();
    const years = [];
    for (let i = 0; i < 6; i++) {
      years.push(y - i);
    }
    setYearOptions(years);
  }, [today]);

  // load current month on mount
  useEffect(() => {
    fetchCurrentMonth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- FETCHERS ----------

  const fetchCurrentMonth = async () => {
    setLoading(true);
    try {
      const res = await getCurrentMonthExpenses();
      const data = res.data || [];
      setExpenses(data);
      setPage(0);
      setTotalPages(0);
    } catch (err) {
      console.error("Failed to load current month expenses", err);
      setExpenses([]);
    }
    setLoading(false);
  };

  const fetchByMonth = async (year, month) => {
    setLoading(true);
    try {
      const res = await getExpensesByMonth(year, month);
      const data = res.data || [];
      setExpenses(data);
      setPage(0);
      setTotalPages(0);
    } catch (err) {
      console.error("Failed to load filtered expenses", err);
      setExpenses([]);
    }
    setLoading(false);
  };

  const fetchByYear = async (year) => {
    setLoading(true);
    try {
      const res = await getExpensesByYear(year);
      const data = res.data || [];
      setExpenses(data);
      setPage(0);
      setTotalPages(0);
    } catch (err) {
      console.error("Failed to load year expenses", err);
      setExpenses([]);
    }
    setLoading(false);
  };

  // Paginated fetch (preferred when using pagination)
  const fetchPaginated = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const res = await getExpensesPaginated(pageNumber, size);
      // backend may return Page object with .content or a plain array
      const body = res.data;
      let list = [];
      let pages = 0;
      if (Array.isArray(body)) {
        list = body;
      } else if (body && body.content) {
        list = body.content;
        pages = body.totalPages || 0;
      } else {
        // unknown structure -> try body.data or body
        list = body.data || body || [];
      }
      setExpenses(list);
      setPage(pageNumber);
      setTotalPages(pages);
    } catch (err) {
      console.error("Pagination fetch failed", err);
      setExpenses([]);
    }
    setLoading(false);
  };

  const fetchByDateRange = async (start, end) => {
    setLoading(true);
    try {
      const res = await getExpensesByDateRange(start, end);
      setExpenses(res.data || []);
      setPage(0);
      setTotalPages(0);
    } catch (err) {
      console.error("Failed to load date range", err);
      setExpenses([]);
    }
    setLoading(false);
  };

  // ---------- ACTIONS ----------

  const onFilterChange = (mode) => {
    if (mode === "current") {
      fetchCurrentMonth();
      return;
    }
    if (mode === "month") {
      fetchByMonth(selectedYear, selectedMonth);
    } else if (mode === "year") {
      fetchByYear(selectedYear);
    }
  };

  const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  // toggle group-by-day
  useEffect(() => {
    if (groupByDayMode) {
      setGrouped(groupByDay(expenses));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupByDayMode, expenses]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await deleteExpenseById(id);
      // after delete, refresh current view
      if (totalPages > 0) {
        fetchPaginated(page);
      } else {
        fetchCurrentMonth();
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete expense");
    }
  };

  const startEdit = (exp) => {
    // clone object and open inline editor (simple)
    setEditingExpense({ ...exp });
  };

  const cancelEdit = () => setEditingExpense(null);

  const saveEdit = async () => {
    if (!editingExpense) return;
    try {
      // create expense data object expected by backend
      const { id, title, amount, date, category, imageUrl } = editingExpense;
      const expenseData = { title, amount, date, category, imageUrl };
      await updateExpense(id, expenseData);
      setEditingExpense(null);
      // refresh
      if (totalPages > 0) fetchPaginated(page);
      else fetchCurrentMonth();
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update expense");
    }
  };

  // date-range submit handler
  const applyDateRange = () => {
    if (!rangeStart || !rangeEnd) {
      alert("Select both start and end date");
      return;
    }
    fetchByDateRange(rangeStart, rangeEnd);
  };

  // pager controls
  const onPrev = () => {
    if (page > 0) fetchPaginated(page - 1);
  };
  const onNext = () => {
    if (totalPages > 0 && page + 1 < totalPages) fetchPaginated(page + 1);
  };

  return (
    <div className="expenses-page">
      <div className="expenses-header">
        <h2>My Expenses</h2>

        <div className="filters">
          <div className="filter-group">
            <label>Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {monthNames.map((m, idx) => (
                <option key={m} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-actions">
            <button className="btn" onClick={() => onFilterChange("month")}>
              Filter Month
            </button>
            <button className="btn" onClick={() => onFilterChange("year")}>
              Filter Year
            </button>
            <button className="btn secondary" onClick={() => onFilterChange("current")}>
              Recent Month
            </button>
          </div>
        </div>
      </div>

      {/* date range picker */}
     <div className="date-range">
  <label>
    From:
    <input
      type="date"
      value={rangeStart}
      onChange={(e) => setRangeStart(e.target.value)}
    />
  </label>

  <label>
    To:
    <input
      type="date"
      value={rangeEnd}
      onChange={(e) => setRangeEnd(e.target.value)}
    />
  </label>

  <button className="btn" onClick={applyDateRange}>Apply Range</button>

  {/* New Clear Button */}
  {(rangeStart || rangeEnd) && (
    <button
      className="btn secondary"
      onClick={() => {
        setRangeStart("");
        setRangeEnd("");
        fetchCurrentMonth(); // reset to recent month
      }}
    >
      Clear Range
    </button>
  )}
</div>


      <div className="controls-row">
        <label>
          <input type="checkbox" checked={groupByDayMode} onChange={(e) => setGroupByDayMode(e.target.checked)} />
          Group by day
        </label>

        <div className="pager-controls">
          <button className="btn small" onClick={() => fetchPaginated(0)}>Load Paginated</button>
          <button className="btn small" onClick={onPrev} disabled={page === 0}>Prev</button>
          <span className="pager-info">Page {page + 1}{totalPages ? ` / ${totalPages}` : ""}</span>
          <button className="btn small" onClick={onNext} disabled={totalPages ? page + 1 >= totalPages : false}>Next</button>
        </div>
      </div>

      <div className="expenses-summary">
        <div>Total: <strong>₹ {total.toFixed(2)}</strong></div>
        <div>{loading ? "Loading..." : `${expenses.length} item(s)`}</div>
      </div>

      <div className="expenses-list">
        {loading && <div className="empty">Loading...</div>}

        {!groupByDayMode && !loading && expenses.length === 0 && (
          <div className="empty">No expenses found for selected period.</div>
        )}

        {/* GROUP BY DAY VIEW */}
        {groupByDayMode && grouped.map((group) => (
          <div className="group" key={group.date}>
            <div className="group-header">
              <strong>{new Date(group.date).toLocaleDateString()}</strong>
              <span className="group-total">Total: ₹ {group.items.reduce((s, it) => s + Number(it.amount||0), 0).toFixed(2)}</span>
            </div>
            {group.items.map((exp) => (
              <div className="expense-card" key={exp.id}>
                <div className="expense-left">
                  <div className="expense-title">{exp.title}</div>
                  <div className="expense-meta">
                    <span className="expense-category">{exp.category}</span>
                  </div>
                </div>

                <div className="expense-right">
                  <div className="expense-amount">₹ {Number(exp.amount).toFixed(2)}</div>

                  <div className="card-actions">
                    <button className="btn small" onClick={() => startEdit(exp)}>Edit</button>
                    <button className="btn small danger" onClick={() => handleDelete(exp.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* LIST VIEW */}
        {!groupByDayMode && expenses.map((exp) => (
          <div className="expense-card" key={exp.id}>
            <div className="expense-left">
              <div className="expense-title">{exp.title}</div>
              <div className="expense-meta">
                <span className="expense-date">{exp.date ? new Date(exp.date).toLocaleDateString() : ""}</span>
                <span className="expense-category">{exp.category}</span>
              </div>
            </div>

            <div className="expense-right">
              <div className="expense-amount">₹ {Number(exp.amount).toFixed(2)}</div>
             

             <div className="card-actions">
  <button className="btn small" onClick={() => setViewExpense(exp)}>View</button>
  <button className="btn small" onClick={() => startEdit(exp)}>Edit</button>
  <button className="btn small danger" onClick={() => handleDelete(exp.id)}>Delete</button>
</div>

            </div>
          </div>
        ))}

        {/* Edit Inline Modal */}
        {editingExpense && (
          <div className="edit-modal">
            <div className="edit-card">
              <h3>Edit Expense</h3>
              <label>Title
                <input value={editingExpense.title} onChange={(e) => setEditingExpense(prev => ({...prev, title: e.target.value}))} />
              </label>
              <label>Amount
                <input type="number" value={editingExpense.amount} onChange={(e) => setEditingExpense(prev => ({...prev, amount: e.target.value}))} />
              </label>
              <label>Date
                <input type="date" value={editingExpense.date ? editingExpense.date.slice(0,10) : ""} onChange={(e) => setEditingExpense(prev => ({...prev, date: e.target.value}))} />
              </label>
              <label>Category
                <input value={editingExpense.category} onChange={(e) => setEditingExpense(prev => ({...prev, category: e.target.value}))} />
              </label>

              <div className="edit-actions">
                <button className="btn" onClick={saveEdit}>Save</button>
                <button className="btn" onClick={cancelEdit}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {viewExpense && (
  <div className="edit-modal">
    <div className="edit-card" style={{ maxWidth: "500px" }}>
      <h3>Expense Details</h3>

      <p><strong>Title:</strong> {viewExpense.title}</p>
      <p><strong>Amount:</strong> ₹ {Number(viewExpense.amount).toFixed(2)}</p>
      <p><strong>Date:</strong> {viewExpense.date ? new Date(viewExpense.date).toLocaleDateString() : "-"}</p>
      <p><strong>Category:</strong> {viewExpense.category}</p>

      {viewExpense.imageUrl && (
        <>
          <p><strong>Receipt:</strong></p>
          <img 
            src={viewExpense.imageUrl} 
            alt="Receipt" 
            style={{ width: "100%", borderRadius: "8px", marginTop: "8px" }} 
          />
        </>
      )}

      <div className="edit-actions" style={{ marginTop: "15px" }}>
        <button className="btn" onClick={() => setViewExpense(null)}>Close</button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>

    
  );
};

export default MyExpenses;
