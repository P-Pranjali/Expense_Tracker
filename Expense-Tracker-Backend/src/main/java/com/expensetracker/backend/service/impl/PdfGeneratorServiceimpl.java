//package com.expensetracker.backend.service;
//
//import com.expensetracker.backend.model.Expense;
//import com.lowagie.text.*;
//import com.lowagie.text.pdf.*;
//import org.springframework.stereotype.Service;
//
//import java.awt.Color;    // <-- KEEP ONLY THIS
//import java.io.ByteArrayOutputStream;
//import java.text.SimpleDateFormat;
//import java.time.LocalDate;
//import java.time.format.DateTimeFormatter;
//import java.util.List;
//
//@Service
//public class PdfGeneratorService {
//
//    public byte[] generateYearlyExpensePdf(List<Expense> expenses, int year) throws Exception {
//
//        ByteArrayOutputStream output = new ByteArrayOutputStream();
//        Document document = new Document(PageSize.A4, 25, 25, 25, 25);
//
//        PdfWriter.getInstance(document, output);
//        document.open();
//
//        // -----------------------------
//        // FIX: Load Unicode Font (₹ supported)
//        // -----------------------------
//        // -----------------------------
//// FIX: Load Unicode Font SAFELY (₹ supported)
//// -----------------------------
//        var fontStream = getClass().getClassLoader().getResourceAsStream("fonts/NotoSans-Regular.ttf");
//        if (fontStream == null) {
//            throw new RuntimeException("Font file not found in resources/fonts/");
//        }
//
//        BaseFont unicode = BaseFont.createFont(
//                "NotoSans-Regular.ttf",
//                BaseFont.IDENTITY_H,
//                BaseFont.EMBEDDED,
//                false,
//                fontStream.readAllBytes(),
//                null
//        );
//
//
//
//        Font titleFont = new Font(unicode, 18, Font.BOLD);
//        Font headerFont = new Font(unicode, 12, Font.BOLD);
//        Font rowFont = new Font(unicode, 11);
//        // -----------------------------
//
//        // Title
//        Paragraph title = new Paragraph("Expense Report - " + year, titleFont);
//        title.setAlignment(Element.ALIGN_CENTER);
//        title.setSpacingAfter(20);
//        document.add(title);
//
//        // Table (5 columns)
//        PdfPTable table = new PdfPTable(5);
//        table.setWidthPercentage(100);
//        table.setSpacingBefore(10);
//        table.setWidths(new float[]{2.5f, 2f, 2f, 2f, 2f});
//
//        String[] headers = {"Title", "Category", "Amount (₹)", "Date", "Note"};
//        for (String h : headers) {
//            PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
//            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
//            cell.setBackgroundColor(Color.LIGHT_GRAY);
//            cell.setPadding(8);
//            table.addCell(cell);
//        }
//
//        SimpleDateFormat sdf = new SimpleDateFormat("dd MMM yyyy");
//        double total = 0;
//
//        for (Expense exp : expenses) {
//
//            String formattedDate = exp.getDate().format(
//                    java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy")
//            );
//            table.addCell(makeCell(exp.getTitle(), rowFont));
//            table.addCell(makeCell(exp.getCategory(), rowFont));
//            table.addCell(makeCell("₹ " + exp.getAmount(), rowFont));
//            //table.addCell(makeCell(sdf.format(exp.getDate()), rowFont));
//            // FIXED DATE HANDLING
//            table.addCell(makeCell(formattedDate, rowFont));
//            table.addCell(makeCell(
//                    exp.getNote() == null ? "-" : exp.getNote(), rowFont
//            ));
//
//            total += exp.getAmount();
//        }
//
//        // Total row
//        PdfPCell totalCell = new PdfPCell(new Phrase("Total", headerFont));
//        totalCell.setColspan(2);
//        totalCell.setHorizontalAlignment(Element.ALIGN_CENTER);
//        totalCell.setPadding(10);
//        table.addCell(totalCell);
//
//        PdfPCell totalValue = new PdfPCell(new Phrase("₹ " + total, headerFont));
//        totalValue.setColspan(3);
//        totalValue.setHorizontalAlignment(Element.ALIGN_CENTER);
//        totalValue.setPadding(10);
//        totalValue.setBackgroundColor(new Color(224, 255, 224));
//        table.addCell(totalValue);
//
//        document.add(table);
//        document.close();
//
//        return output.toByteArray();
//    }
//
//    private PdfPCell makeCell(String text, Font font) {
//        PdfPCell cell = new PdfPCell(new Phrase(text, font));
//        cell.setPadding(8);
//        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
//        return cell;
//    }
//}

package com.expensetracker.backend.service.impl;

import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.service.PdfGeneratorService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

@Service
public class PdfGeneratorServiceimpl implements PdfGeneratorService {

    // Keep categories & colors in the same order as your React UI
    private static final String[] CATEGORIES = {
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
    };

    private static final Map<String, Color> CATEGORY_COLOR_MAP = new LinkedHashMap<>() {{
        put("Bills", new Color(0xE3,0xEA,0xFF));
        put("Subscriptions", new Color(0xFF,0xE3,0xEC));
        put("Entertainment", new Color(0xE6,0xF4,0xFF));
        put("Food", new Color(0xFF,0xF4,0xD6));
        put("Groceries", new Color(0xE5,0xF9,0xF7));
        put("Hospital", new Color(0xF3,0xE8,0xFF));
        put("Shopping", new Color(0xFF,0xE8,0xD9));
        put("Transport", new Color(0xE8,0xF5,0xE9));
        put("veggies & fruits", new Color(0xFD,0xEC,0xEA));
        put("Daily Needs", new Color(0xF3,0xE5,0xF5));
        put("Other", new Color(0xF0,0xE6,0xDC));
    }};

    // Column background colors for month & total columns
    private static final Color MONTH_COL_COLOR = new Color(0xE5,0xE7,0xEB);
    private static final Color TOTAL_COL_COLOR = new Color(0xCB,0xD5,0xE1);
    private static final Color TOTAL_ROW_BG = new Color(0xE2,0xE8,0xF0);
    private static final Color TOTAL_VALUE_BG = new Color(224, 255, 224); // keep as earlier if needed

    public byte[] generateYearlyExpensePdf(List<Expense> expenses, int year) throws Exception {
        ByteArrayOutputStream output = new ByteArrayOutputStream();

        // Use landscape A4 so wide tables fit nicely
        Document document = new Document(PageSize.A4.rotate(), 20, 20, 20, 20);

        PdfWriter.getInstance(document, output);
        document.open();

        // Load embedded font (NotoSans)
        var fontStream = getClass().getClassLoader().getResourceAsStream("fonts/NotoSans-Regular.ttf");
        if (fontStream == null) {
            throw new RuntimeException("Font file not found in resources/fonts/NotoSans-Regular.ttf");
        }

        BaseFont baseFont = BaseFont.createFont(
                "NotoSans-Regular.ttf",
                BaseFont.IDENTITY_H,
                BaseFont.EMBEDDED,
                false,
                fontStream.readAllBytes(),
                null
        );

        Font titleFont = new Font(baseFont, 20, Font.BOLD);
        Font headerFont = new Font(baseFont, 10, Font.BOLD);
        Font cellFont = new Font(baseFont, 9, Font.NORMAL);
        Font cellBoldFont = new Font(baseFont, 9, Font.BOLD);

        // Title
        Paragraph title = new Paragraph("Expense Report - " + year, titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(12f);
        document.add(title);

        // Prepare table: Month + categories.length + Total
        int totalColumns = 1 + CATEGORIES.length + 1;
        PdfPTable table = new PdfPTable(totalColumns);
        table.setWidthPercentage(100);

        // Reasonable widths: month narrow, categories flexible, total small
        float[] widths = new float[totalColumns];
        widths[0] = 1.4f; // month column
        for (int i = 1; i <= CATEGORIES.length; i++) widths[i] = 1.15f;
        widths[totalColumns - 1] = 1.2f; // total
        table.setWidths(widths);
        table.setSpacingBefore(6f);

        // Header row
        PdfPCell monthHeader = new PdfPCell(new Phrase("Month", headerFont));
        monthHeader.setHorizontalAlignment(Element.ALIGN_CENTER);
        monthHeader.setVerticalAlignment(Element.ALIGN_MIDDLE);
        monthHeader.setBackgroundColor(MONTH_COL_COLOR);
        monthHeader.setPadding(6f);
        table.addCell(monthHeader);

        for (String cat : CATEGORIES) {
            PdfPCell h = new PdfPCell(new Phrase(cat, headerFont));
            h.setHorizontalAlignment(Element.ALIGN_CENTER);
            h.setVerticalAlignment(Element.ALIGN_MIDDLE);
            Color bg = CATEGORY_COLOR_MAP.getOrDefault(cat, Color.WHITE);
            h.setBackgroundColor(bg);
            h.setPadding(6f);
            table.addCell(h);
        }

        PdfPCell totalHeader = new PdfPCell(new Phrase("Total", headerFont));
        totalHeader.setHorizontalAlignment(Element.ALIGN_CENTER);
        totalHeader.setVerticalAlignment(Element.ALIGN_MIDDLE);
        totalHeader.setBackgroundColor(TOTAL_COL_COLOR);
        totalHeader.setPadding(6f);
        table.addCell(totalHeader);

        // Build a 12xN matrix with zeros, fill with expenses
        // months 0..11
        double[][] monthCatSums = new double[12][CATEGORIES.length];

        // fill from expenses list (already filtered by user & year before calling)
        for (Expense e : expenses) {
            LocalDate d = e.getDate();
            if (d == null) continue;
            if (d.getYear() != year) continue;
            String cat = e.getCategory();
            int catIndex = -1;
            for (int i = 0; i < CATEGORIES.length; i++) {
                if (CATEGORIES[i].equals(cat)) { catIndex = i; break; }
            }
            if (catIndex < 0) continue; // ignore categories not in fixed list
            int m = d.getMonthValue() - 1; // 0-based
            monthCatSums[m][catIndex] += e.getAmount();
        }

        // date formatter for display
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMMM");

        // Add 12 rows (January..December)
        for (int m = 0; m < 12; m++) {
            // Month cell
            PdfPCell monthCell = new PdfPCell(new Phrase(getMonthName(m), cellBoldFont));
            monthCell.setBackgroundColor(MONTH_COL_COLOR);
            monthCell.setHorizontalAlignment(Element.ALIGN_LEFT);
            monthCell.setPadding(6f);
            table.addCell(monthCell);

            double rowTotal = 0.0;
            for (int c = 0; c < CATEGORIES.length; c++) {
                double val = monthCatSums[m][c];
                rowTotal += val;

                String text = String.format("%.0f", val); // integer display
                PdfPCell cell = new PdfPCell(new Phrase(text, cellFont));
                Color bg = CATEGORY_COLOR_MAP.getOrDefault(CATEGORIES[c], Color.WHITE);
                cell.setBackgroundColor(bg);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(6f);
                table.addCell(cell);
            }

            PdfPCell rowTotalCell = new PdfPCell(new Phrase(String.format("%.0f", rowTotal), cellBoldFont));
            rowTotalCell.setBackgroundColor(TOTAL_ROW_BG);
            rowTotalCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            rowTotalCell.setPadding(6f);
            table.addCell(rowTotalCell);
        }

        // Totals row at bottom
        PdfPCell totalLabel = new PdfPCell(new Phrase("Total", headerFont));
        totalLabel.setBackgroundColor(new Color(0xD1,0xD5,0xDB));
        totalLabel.setHorizontalAlignment(Element.ALIGN_LEFT);
        totalLabel.setPadding(6f);
        table.addCell(totalLabel);

        // Column totals for each category
        double grandTotal = 0.0;
        for (int c = 0; c < CATEGORIES.length; c++) {
            double colSum = 0.0;
            for (int m = 0; m < 12; m++) colSum += monthCatSums[m][c];
            grandTotal += colSum;
            PdfPCell sumCell = new PdfPCell(new Phrase(String.format("%.0f", colSum), cellBoldFont));
            sumCell.setBackgroundColor(CATEGORY_COLOR_MAP.getOrDefault(CATEGORIES[c], Color.WHITE));
            sumCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            sumCell.setPadding(6f);
            table.addCell(sumCell);
        }

        PdfPCell grandCell = new PdfPCell(new Phrase(String.format("%.0f", grandTotal), cellBoldFont));
        grandCell.setBackgroundColor(TOTAL_COL_COLOR);
        grandCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        grandCell.setPadding(6f);
        table.addCell(grandCell);

        // Add table to document
        document.add(table);
        document.close();

        return output.toByteArray();
    }

    private String getMonthName(int zeroBasedMonth) {
        return java.time.Month.of(zeroBasedMonth + 1).name().substring(0,1).toUpperCase()
                + java.time.Month.of(zeroBasedMonth + 1).name().substring(1).toLowerCase();
        // Or use a formatter if you prefer full names from Locale
    }
}
