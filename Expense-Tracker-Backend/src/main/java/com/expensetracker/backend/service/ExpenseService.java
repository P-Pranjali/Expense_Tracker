package com.expensetracker.backend.service;

import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

//import java.awt.print.Pageable;
import org.springframework.data.domain.Pageable;

import java.util.*;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    // Create or Update
    public Expense saveExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    // Read all
    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    // Read one
    public Optional<Expense> getExpenseById(String id) {
        return expenseRepository.findById(id);
    }

    // Delete
    public void deleteExpense(String id) {
        expenseRepository.deleteById(id);
    }

    // ===============================
    //      FILTERING METHODS
    // ===============================

    // Get expenses for a specific month & year
    public List<Expense> getExpensesByMonth(int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth().plusDays(1);
        return expenseRepository.findByDateBetween(start, end);
    }

    // Get expenses for the whole year
    public List<Expense> getExpensesByYear(int year, String userId) {
        LocalDate start = LocalDate.of(year, 1, 1);
        LocalDate end = LocalDate.of(year, 12, 31).plusDays(1);
        return expenseRepository.findByUserIdAndDateBetween(userId, start, end);
    }

    // Get current month expenses
    public List<Expense> getCurrentMonthExpenses() {
        YearMonth current = YearMonth.now();
        LocalDate start = current.atDay(1);
        LocalDate end = current.atEndOfMonth().plusDays(1);
        return expenseRepository.findByDateBetween(start, end);
    }
    public Page<Expense> getPaginatedExpenses(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return expenseRepository.findAll(pageable);
    }
    public List<Expense> getExpensesByDateRange(LocalDate start, LocalDate end) {
        return expenseRepository.findByDateBetween(start, end.plusDays(1));
    }
    public List<Map<String, Object>> getExpensesGroupedByDay() {
        List<Expense> expenses = expenseRepository.findAll();

        return expenses.stream()
                .collect(Collectors.groupingBy(Expense::getDate))
                .entrySet()
                .stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<String, Object>();
                    map.put("date", entry.getKey());
                    map.put("totalAmount",
                            entry.getValue().stream().mapToDouble(Expense::getAmount).sum());
                    map.put("expenses", entry.getValue());
                    return map;
                })
                .sorted(Comparator.comparing(
                        (Map<String, Object> m) -> (LocalDate) m.get("date")
                ).reversed())
                .collect(Collectors.toList());
    }


    public List<Expense> getExpensesByUserId(String userId) {
        return expenseRepository.findByUserId(userId);
    }
    // ===============================
//      DELETE MULTIPLE
// ===============================
    public void deleteMultipleExpenses(List<String> ids, String userId) {

        // Fetch all expenses by these IDs
        List<Expense> expenses = expenseRepository.findAllById(ids);

        // Validate all belong to logged-in user
        for (Expense exp : expenses) {
            if (!exp.getUserId().equals(userId)) {
                throw new RuntimeException("Unauthorized delete detected for expense: " + exp.getId());
            }
        }

        // Now delete all
        expenseRepository.deleteAllById(ids);
    }


}
