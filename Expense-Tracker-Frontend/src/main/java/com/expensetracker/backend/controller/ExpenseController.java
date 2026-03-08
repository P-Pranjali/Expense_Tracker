package com.expensetracker.backend.controller;

import com.expensetracker.backend.config.JwtUtil;
import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.service.ExpenseService;
import com.expensetracker.backend.service.ImageUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;   // <-- IMPORTANT IMPORT
import com.expensetracker.backend.service.PdfGeneratorService;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@Slf4j
@RestController
@CrossOrigin(origins = "*") // Allow Frontend access
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private ImageUploadService imageUploadService; // <-- IMPORTANT

    @Autowired
    private PdfGeneratorService pdfGeneratorService;

    @Autowired
    private JwtUtil jwtUtil;


    private String getUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7);
        return jwtUtil.extractUserId(token);
    }

    // Create
    @PostMapping(value = "", consumes = {"multipart/form-data"})
    public Expense addExpense(
            @RequestHeader("Authorization") String authHeader,   // <--- ADD
            @RequestPart("expense") Expense expense,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        log.info("Received expense with image: {}", expense);

        try {

            String userId = getUserIdFromToken(authHeader);   // <--- EXTRACT USER ID
            expense.setUserId(userId);

            if (image != null && !image.isEmpty()) {
                String imageUrl = imageUploadService.uploadImage(image);
                expense.setImageUrl(imageUrl);

                // <-- ADDING IMAGE URL HERE
            }

            return expenseService.saveExpense(expense);

        } catch (Exception e) {
            throw new RuntimeException("Failed to save expense with image: " + e.getMessage());
        }
    }

    // Read all
    @GetMapping("/all")
    public List<Expense> getAllExpenses(@RequestHeader("Authorization") String authHeader) {
        log.info("Fetching all expenses");
        String userId = getUserIdFromToken(authHeader);
        return expenseService.getExpensesByUserId(userId);
    }

    // Read one
    @GetMapping("/{id}")
    public Optional<Expense> getExpenseById(@PathVariable String id) {

        return expenseService.getExpenseById(id);
    }

    @GetMapping
    public List<Expense> getExpenses(@RequestParam String userId) {
        return expenseService.getExpensesByUserId(userId);
    }


    // Update
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public Expense updateExpense(
            @RequestHeader("Authorization") String authHeader,   // <--- ADD
            @PathVariable String id,
            @RequestPart("expense") Expense expense,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {

        try {
            String userId = getUserIdFromToken(authHeader);
            // Get existing expense from DB
            Expense existing = expenseService.getExpenseById(id)
                    .orElseThrow(() -> new RuntimeException("Expense not found"));

            // Prevent editing other users’ expenses
            if (!existing.getUserId().equals(userId)) {
                throw new RuntimeException("Unauthorized access to expense");
            }

            // If new image uploaded → replace
            if (image != null && !image.isEmpty()) {
                String imageUrl = imageUploadService.uploadImage(image);
                expense.setImageUrl(imageUrl);
            } else {
                // No new image → keep old
                expense.setImageUrl(existing.getImageUrl());

            }

            expense.setId(id);
            expense.setUserId(userId);  // <--- IMPORTANT
            return expenseService.saveExpense(expense);

        } catch (Exception e) {
            throw new RuntimeException("Failed to update expense with image: " + e.getMessage());
        }
    }


    // Delete
    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable String id) {
        log.info("Deleting expense with id: {}", id);
        expenseService.deleteExpense(id);
    }


    // =========================
    // FILTER: MONTH + YEAR
    // =========================
    @GetMapping("/month/{year}/{month}")
    public List<Expense> getExpensesByMonth(
            @PathVariable int year,
            @PathVariable int month
    ) {
        log.info("Fetching expenses for {}/{}", month, year);
        return expenseService.getExpensesByMonth(year, month);
    }

    // =========================
    // FILTER: YEAR
    // =========================
    @GetMapping("/year/{year}")
    public List<Expense> getExpensesByYear(@PathVariable int year, String userId) {
        log.info("Fetching expenses for year: {}", year);
        return expenseService.getExpensesByYear(year, userId);
    }

    // =========================
    // FILTER: CURRENT MONTH
    // =========================
    @GetMapping("/current-month")
    public List<Expense> getCurrentMonthExpenses() {
        log.info("Fetching expenses for current month");
        return expenseService.getCurrentMonthExpenses();
    }



    @GetMapping("/paginated")
    public Page<Expense> getPaginatedExpenses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return expenseService.getPaginatedExpenses(page, size);
    }
    @GetMapping("/range")
    public List<Expense> getExpensesByDateRange(
            @RequestParam String start,
            @RequestParam String end
    ) {
        LocalDate s = LocalDate.parse(start);
        LocalDate e = LocalDate.parse(end);
        return expenseService.getExpensesByDateRange(s, e);
    }

    @GetMapping("/group-by-day")
    public List<Map<String, Object>> getExpensesGroupedByDay() {
        return expenseService.getExpensesGroupedByDay();
    }


    @GetMapping("/pdf/yearly/{year}")
    public ResponseEntity<byte[]> downloadYearlyPdf(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable int year)
    {
        log.info("Generating yearly PDF for year {}", year);

        try {
            String userId = getUserIdFromToken(authHeader);

            List<Expense> expenses = expenseService.getExpensesByYear(year, userId);
            log.info("User {} | Year {} | Loaded {} expenses", userId, year, expenses.size());

            byte[] pdf = pdfGeneratorService.generateYearlyExpensePdf(expenses, year);

            log.info("PDF generated successfully: {} bytes", pdf.length); // LOG THIS

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=Expense_Report_" + year + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);

        } catch (Exception e) {
            log.error("PDF generation error: ", e);  // LOG ERROR
            return ResponseEntity.status(500).body(null);
        }
    }





}
