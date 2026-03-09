package com.expensetracker.backend.service.impl;
import com.expensetracker.backend.entity.Envelope;
import com.expensetracker.backend.repository.EnvelopeRepository;
import com.expensetracker.backend.service.EnvelopeService;
//import com.finance.manager.backend.model.Envelope;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class EnvelopeServiceImpl implements EnvelopeService {

    private final EnvelopeRepository envelopeRepository;

    // CREATE Envelope
    public Envelope createEnvelope(Envelope envelope, String userId) {

        // Prevent duplicate category names for same user
        if (envelopeRepository.existsByNameAndUserId(envelope.getName(), userId)) {
            throw new RuntimeException("Envelope with this name already exists!");
        }

        envelope.setUserId(userId);
        envelope.setCreatedAt(Instant.now().toString()); // <-- set createdAt
        envelope.setUpdatedAt(Instant.now().toString()); // <-- set updatedAt
        return envelopeRepository.save(envelope);
    }

    // GET all envelopes for logged-in user
    public List<Envelope> getEnvelopes(String userId) {
        return envelopeRepository.findByUserId(userId);
    }

    // UPDATE envelope
    public Envelope updateEnvelope(String envelopeId, Envelope updated, String userId) {

        Envelope existing = envelopeRepository.findByIdAndUserId(envelopeId, userId);

        if (existing == null) {
            throw new RuntimeException("Envelope not found or unauthorized!");
        }

        existing.setName(updated.getName());
        existing.setBudget(updated.getBudget());
        existing.setSpent(updated.getSpent());

        existing.setColor(updated.getColor());
        existing.setIcon(updated.getIcon());
        existing.setUpdatedAt(Instant.now().toString()); // <-- update updatedAt


        return envelopeRepository.save(existing);
    }

    // DELETE envelope
    public void deleteEnvelope(String envelopeId, String userId) {

        Envelope existing = envelopeRepository.findByIdAndUserId(envelopeId, userId);

        if (existing == null) {
            throw new RuntimeException("Envelope not found or unauthorized!");
        }

        envelopeRepository.delete(existing);
    }


}
