CREATE TABLE password_change_requests (
    id           BIGSERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    status       VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    requested_at TIMESTAMP    NOT NULL DEFAULT NOW()
);
