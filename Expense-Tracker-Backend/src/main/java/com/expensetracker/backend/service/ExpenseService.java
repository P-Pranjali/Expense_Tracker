package com.expensetracker.backend.service;

import com.expensetracker.backend.entity.Expense;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ExpenseService {

    // Create or Update
    Expense saveExpense(Expense expense);

    // Read all
    List<Expense> getAllExpenses();

    // Read one
    Optional<Expense> getExpenseById(String id);

    // Delete
    void deleteExpense(String id);

    // Filtering methods
    List<Expense> getExpensesByMonth(int year, int month);

    List<Expense> getExpensesByYear(int year, String userId);

    List<Expense> getCurrentMonthExpenses();

    Page<Expense> getPaginatedExpenses(int page, int size);

    List<Expense> getExpensesByDateRange(LocalDate start, LocalDate end);

    List<Map<String, Object>> getExpensesGroupedByDay();

    List<Expense> getExpensesByUserId(String userId);

    // Delete multiple expenses
    void deleteMultipleExpenses(List<String> ids, String userId);
}