package com.expensetracker.backend.service;

import com.expensetracker.backend.model.Expense;
import java.util.List;

public interface PdfGeneratorService {

    /**
     * Generates a PDF report for yearly expenses.
     *
     * @param expenses List of expenses (filtered by user & year)
     * @param year The year for which the report is generated
     * @return Byte array representing the PDF file
     * @throws Exception if PDF generation fails
     */
    byte[] generateYearlyExpensePdf(List<Expense> expenses, int year) throws Exception;
}