ALTER TABLE overtime_requests
    ADD COLUMN cancellation_reason TEXT,
    ADD COLUMN cancelled_at TIMESTAMP;
