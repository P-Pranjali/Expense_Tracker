package com.expensetracker.backend.repository;

import com.expensetracker.backend.model.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

//import java.awt.print.Pageable;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends MongoRepository<Expense, String> {

    // Expenses between 2 dates
    List<Expense> findByDateBetween(LocalDate start, LocalDate end);
    Page<Expense> findAll(Pageable pageable);
    List<Expense> findByUserId(String userId);
    // If needed later
    List<Expense> findByUserIdAndDateBetween(String userId, LocalDate start, LocalDate end);
    // NEW → fetch multiple expenses by IDs (needed for validation before deleting)
    List<Expense> findAllById(List<String> ids);
}
