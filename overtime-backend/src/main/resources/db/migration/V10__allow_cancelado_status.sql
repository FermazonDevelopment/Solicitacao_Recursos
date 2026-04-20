ALTER TABLE overtime_requests
    DROP CONSTRAINT IF EXISTS overtime_requests_status_check;

ALTER TABLE overtime_requests
    ADD CONSTRAINT overtime_requests_status_check
        CHECK (status IN ('PENDENTE', 'CONFIRMADO', 'CANCELADO'));
