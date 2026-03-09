package com.expensetracker.backend.service;
//import com.finance.manager.backend.model.Envelope;

import com.expensetracker.backend.entity.Envelope;

import java.util.List;

public interface EnvelopeService {

    // CREATE a new envelope
    Envelope createEnvelope(Envelope envelope, String userId);

    // GET all envelopes for a specific user
    List<Envelope> getEnvelopes(String userId);

    // UPDATE an existing envelope
    Envelope updateEnvelope(String envelopeId, Envelope updated, String userId);

    // DELETE an envelope
    void deleteEnvelope(String envelopeId, String userId);
}