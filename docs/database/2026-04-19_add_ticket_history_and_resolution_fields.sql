-- Ticket workflow enhancements:
-- 1) Resolution notes and closed timestamp on tickets
-- 2) Editable metadata on ticket comments
-- 3) Full ticket activity audit table

ALTER TABLE tickets
    ADD COLUMN resolution_notes VARCHAR(1000) NULL,
    ADD COLUMN closed_at DATETIME NULL;

ALTER TABLE ticket_comments
    ADD COLUMN updated_at DATETIME NULL,
    ADD COLUMN edited BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE ticket_comments
SET updated_at = created_at
WHERE updated_at IS NULL;

CREATE TABLE ticket_activity (
    id BIGINT NOT NULL AUTO_INCREMENT,
    ticket_id BIGINT NOT NULL,
    action_type VARCHAR(64) NOT NULL,
    previous_status VARCHAR(32) NULL,
    new_status VARCHAR(32) NULL,
    actor_id BIGINT NULL,
    actor_name VARCHAR(255) NULL,
    description VARCHAR(1000) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_ticket_activity_ticket
        FOREIGN KEY (ticket_id) REFERENCES tickets(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_ticket_activity_ticket_created
    ON ticket_activity(ticket_id, created_at DESC);
