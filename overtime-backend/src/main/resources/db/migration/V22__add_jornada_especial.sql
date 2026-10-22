ALTER TABLE overtime_requests
    DROP CONSTRAINT IF EXISTS overtime_requests_permanencia_check;

ALTER TABLE overtime_requests
    ADD CONSTRAINT overtime_requests_permanencia_check
        CHECK (permanencia IN ('19:30', '21:00', 'until12', 'after12', 'especial'));
