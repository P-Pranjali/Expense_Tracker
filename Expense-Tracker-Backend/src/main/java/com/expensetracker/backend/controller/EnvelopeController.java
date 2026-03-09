package com.expensetracker.backend.controller;
import com.expensetracker.backend.service.EnvelopeService;

import com.expensetracker.backend.entity.Envelope;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/envelopes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EnvelopeController {

    private final EnvelopeService envelopeService;

    // CREATE
    @PostMapping("/create")
    public ResponseEntity<Envelope> createEnvelope(
            @RequestBody Envelope envelope,
            @RequestParam String userId    // later from JWT
    ) {
        return ResponseEntity.ok(envelopeService.createEnvelope(envelope, userId));
    }

    // GET all envelopes for a user
    @GetMapping("/user")
    public ResponseEntity<List<Envelope>> getUserEnvelopes(
            @RequestParam String userId
    ) {
        return ResponseEntity.ok(envelopeService.getEnvelopes(userId));
    }

    // GET a single envelope by ID
    @GetMapping("/{id}")
    public ResponseEntity<Envelope> getEnvelopeById(
            @PathVariable String id,
            @RequestParam String userId
    ) {
        Envelope env = envelopeService
                .getEnvelopes(userId)
                .stream()
                .filter(e -> e.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Envelope not found"));

        return ResponseEntity.ok(env);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Envelope> updateEnvelope(
            @PathVariable String id,
            @RequestBody Envelope updated,
            @RequestParam String userId
    ) {
        return ResponseEntity.ok(envelopeService.updateEnvelope(id, updated, userId));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEnvelope(
            @PathVariable String id,
            @RequestParam String userId
    ) {
        envelopeService.deleteEnvelope(id, userId);
        return ResponseEntity.ok("Envelope deleted!");
    }
}
