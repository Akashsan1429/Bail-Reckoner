CREATE TABLE verdicts (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    case_id VARCHAR(36) NOT NULL,
    outcome VARCHAR(100) NOT NULL,
    risk_band VARCHAR(50) NOT NULL,
    explanation TEXT,
    flight_risk_score INT NOT NULL,
    evidence_risk_score INT NOT NULL,
    procedural_status VARCHAR(100) NOT NULL,
    rule_trace TEXT,
    rule_engine_version VARCHAR(50),
    law_repository_version VARCHAR(50),
    evaluated_at DATETIME(6) NOT NULL,
    CONSTRAINT fk_verdicts_case FOREIGN KEY (case_id) REFERENCES cases (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
