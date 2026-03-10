// FULL FIXED DashboardChart.jsx
// (Pie Chart + Yearly Table + No Right-Side White Space)

import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import "../styles/DashboardChart.css";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ChartDataLabels);
ChartJS.register(ArcElement, Tooltip, Legend);

// ---------------------------------------
// CENTER TEXT PLUGIN
// ---------------------------------------
const centerTextPlugin = {
  id: "centerText",
  afterDraw(chart) {
    const { ctx, chartArea } = chart;
    const total = chart.config.data.datasets[0].data.reduce((a, b) => a + b, 0);

    const cx = (chartArea.left + chartArea.right) / 2;
    const cy = (chartArea.top + chartArea.bottom) / 2;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "700 22px Inter";
    ctx.fillStyle = "#000";
    ctx.fillText(`₹${total.toFixed(0)}`, cx, cy - 6);

    ctx.font = "600 13px Inter";
    ctx.fillText("Total", cx, cy + 14);
    ctx.restore();
  }
};
ChartJS.register(centerTextPlugin);

// ---------------------------------------
// OUTSIDE LABELS PLUGIN
// ---------------------------------------
const outsideLabelsPlugin = {
  id: "outsideLabelsPlugin",
  afterDraw(chart) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    const dataset = chart.data.datasets[0];

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.font = "12px Inter";
    ctx.fillStyle = "#111";

    meta.data.forEach((arc, i) => {
      const val = dataset.data[i];
      if (!val) return;

      const label = chart.data.labels[i];
      const color = dataset.backgroundColor[i];
      const angle = (arc.startAngle + arc.endAngle) / 2;

      const sx = arc.x + Math.cos(angle) * arc.outerRadius;
      const sy = arc.y + Math.sin(angle) * arc.outerRadius;

      const ex = arc.x + Math.cos(angle) * (arc.outerRadius + 10);
      const ey = arc.y + Math.sin(angle) * (arc.outerRadius + 10);

      const bendX = ex + (Math.cos(angle) > 0 ? 20 : -20);
      const bendY = ey;

      const labelX = bendX + (Math.cos(angle) > 0 ? 6 : -6);
      const labelY = bendY + 2;

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(ex, ey, bendX, bendY);
      ctx.stroke();

      ctx.textAlign = Math.cos(angle) > 0 ? "left" : "right";
      ctx.fillText(`${label}: ₹${val}`, labelX, labelY);
    });

    ctx.restore();
  }
};
ChartJS.register(outsideLabelsPlugin);

// FIXED CATEGORY LIST
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

const months = [
  "January","February","March","April","May","June","July",
  "August","September","October","November","December"
];


// Category color map → same for table & pie for consistency:
const categoryColors = {
  "Bills": "#e3eaff",
  "Subscriptions": "#ffe3ec",
  "Entertainment": "#e6f4ff",
  "Food": "#fff4d6",
  "Groceries": "#e5f9f7",
  "Hospital": "#f3e8ff",
  "Shopping": "#ffe8d9",
  "Transport": "#e8f5e9",
  "veggies & fruits": "#fdecea",
  "Daily Needs": "#f3e5f5",
  // "Gifts": "#e0f7fa",
  "Other": "#f0e6dc"
};

const monthColumnColor = "#e5e7eb";

// ---------------------------------------
// MAIN COMPONENT
// ---------------------------------------
const DashboardChart = ({ expenses }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const tableData = buildTableData(expenses);
  const monthTotals = tableData.table[selectedMonth] || {};

  // ALWAYS show all fixed categories
  const pieData = {
    labels: categories,
    datasets: [
      {
        data: categories.map((c) => monthTotals[c] || 0),
        backgroundColor: [
          "#4c7cf3", "#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0",
          "#9966ff", "#ff9f40", "#66bb6a", "#ef5350", "#ab47bc", "#26c6da"
        ].slice(0, categories.length),
        borderColor: "#fff",
        borderWidth: 2
      }
    ]
  };

  const pieOptions = {
    cutout: "60%",
    responsive: true,
    //maintainAspectRatio: false,

    layout: { padding: 100 },
    clip: false,

    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: "center",
        align: "center",
        color: "#000",
        font: { size: 10, weight: "bold" },
        formatter: (v) => (v ? `₹${v}` : ""),
        clip: false,
        clamp: true,
          formatter: (value) => {
          if (value === 0) return "";
          return `₹${value}`;
        }
      }
    }
  };

  return (
    <div className="pie-chart-only">
      <div className="month-select-container">
        <label>Select Month:</label>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
          {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>
      </div>

      <div className="pie-chart-wrapper1">
        <h3>Category-wise Expenses ({months[selectedMonth]})</h3>

        {/* FIX = Added wrapper with strict width control */}
       
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    
  );
};

// ---------------------------------------
// YEARLY TABLE COMPONENT
// ---------------------------------------
DashboardChart.YearlyTable = function YearlyTable({ expenses }) {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const filtered = expenses.filter((e) => new Date(e.date).getFullYear() === selectedYear);
  const tableData = buildTableData(filtered);

  const handleExportPDF = () => {
  const token = localStorage.getItem("token");

  console.log("TOKEN SENT:", token);  // TEMP DEBUG

  fetch(`/api/expenses/pdf/yearly/${selectedYear}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/pdf"
    }
  })
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error("PDF generation failed: " + text);
      }
      return res.blob();
    })
    .then((blob) => {
      const correctedBlob = new Blob([blob], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(correctedBlob);

      const a = document.createElement("a");
      a.href = fileURL;
      a.download = `Expense_Report_${selectedYear}.pdf`;
      a.click();
      URL.revokeObjectURL(fileURL);
    })
    .catch((err) => console.error(err));
};



  return (
    <div className="yearly-table-card">
      <div className="yearly-header">
        <div className="yearly-header-left">
          <h3>Yearly Expense Overview</h3>
          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
            {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <button className="export-btn" onClick={handleExportPDF}>Export PDF</button>
      </div>

      <div className="full-table-wrapper">
        <table className="expense-table">
          <thead>
            <tr>
              <th style={{ background: monthColumnColor}}>Month</th>
              {categories.map((c) => (
                <th key={c} style={{ background: categoryColors[c] }}>{c}</th>
              ))}
              <th style={{ background: "#cbd5e1" }}>Total</th>
            </tr>
          </thead>

          <tbody>
            {months.map((m, row) => {
              const rowTotal = categories.reduce((s, c) => s + (tableData.table[row][c] || 0), 0);

              return (
                <tr key={m}>
                  <td style={{ background: monthColumnColor }}>{m}</td>

                  {categories.map((c) => (
                    <td key={c} style={{ background: categoryColors[c] }}>
                      {(tableData.table[row][c] || 0).toFixed(0)}
                    </td>
                  ))}

                  <td style={{ background: "#e2e8f0" }}>{rowTotal.toFixed(0)}</td>
                </tr>
              );
            })}

            <tr>
              <td style={{ background: "#d1d5db" }}>Total</td>
              {categories.map((c) => {
                const total = tableData.table.reduce((s, m) => s + (m[c] || 0), 0);
                return <td key={c} style={{ background: categoryColors[c] }}>{total.toFixed(0)}</td>;
              })}

              <td style={{ background: "#cbd5e1" }}>
                {tableData.table
                  .flatMap((m) => categories.map((c) => m[c] || 0))
                  .reduce((a, b) => a + b, 0)
                  .toFixed(0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ---------------------------------------
// TABLE BUILDER (STATIC CATEGORY LIST)
// ---------------------------------------
const buildTableData = (filteredExpenses) => {
  const table = Array.from({ length: 12 }, () =>
    Object.fromEntries(categories.map((c) => [c, 0]))
  );

  filteredExpenses.forEach((exp) => {
    const idx = new Date(exp.date).getMonth();
    const cat = exp.category;
    if (categories.includes(cat)) table[idx][cat] += Number(exp.amount) || 0;
  });

  return { months, categories, table };
};

export default DashboardChart;
