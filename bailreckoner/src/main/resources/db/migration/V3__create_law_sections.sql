CREATE TABLE law_sections (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    law_name VARCHAR(255) NOT NULL,
    section_number VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    plain_language_summary TEXT,
    bailable BOOLEAN NOT NULL DEFAULT TRUE,
    maximum_sentence_years INT,
    ipc_equivalent VARCHAR(100),
    bns_equivalent VARCHAR(100),
    crpc_equivalent VARCHAR(100),
    bnss_equivalent VARCHAR(100),
    source VARCHAR(255),
    repository_version VARCHAR(50),
    verified_at DATETIME(6),
    active BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
