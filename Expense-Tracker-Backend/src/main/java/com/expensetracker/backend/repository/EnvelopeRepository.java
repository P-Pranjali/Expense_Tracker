package com.expensetracker.backend.repository;


import com.expensetracker.backend.entity.Envelope;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnvelopeRepository extends MongoRepository<Envelope, String> {

    // Fetch all envelopes for logged-in user
    List<Envelope> findByUserId(String userId);

    // Fetch envelope by id + userId (prevents accessing others' envelopes)
    Envelope findByIdAndUserId(String id, String userId);

    // Prevent duplicate envelope names per user if needed
    boolean existsByNameAndUserId(String name, String userId);
}
