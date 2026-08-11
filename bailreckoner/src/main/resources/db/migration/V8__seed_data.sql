-- Sample Organization
INSERT INTO organizations (id, name, type, created_at)
VALUES ('11111111-1111-1111-1111-111111111111', 'Legal Aid Society DEMO', 'NGO', NOW());

-- Sample Users (Password for all is 'password123')
INSERT INTO users (id, name, email, password, role, organization_id, created_at, updated_at)
VALUES 
('22222222-1111-1111-1111-111111111111', 'Admin User DEMO', 'admin@bailreckoner.org', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQvq47a', 'ADMIN', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('33333333-1111-1111-1111-111111111111', 'Lawyer User DEMO', 'lawyer@bailreckoner.org', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQvq47a', 'LAWYER', '11111111-1111-1111-1111-111111111111', NOW(), NOW()),
('44444444-1111-1111-1111-111111111111', 'Prisoner Family DEMO', 'family@bailreckoner.org', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQvq47a', 'PRISONER_FAMILY', '11111111-1111-1111-1111-111111111111', NOW(), NOW());

-- Sample Law Sections [DEMO DATA]
INSERT INTO law_sections (id, law_name, section_number, title, description, plain_language_summary, bailable, maximum_sentence_years, ipc_equivalent, bns_equivalent, crpc_equivalent, bnss_equivalent, source, repository_version, verified_at, active)
VALUES
('55555555-1111-1111-1111-379111111111', 'Indian Penal Code', '379', 'Punishment for Theft', 'Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.', 'Offence of theft carrying maximum 3 years imprisonment. Bailable offence under statutory schedule.', TRUE, 3, 'IPC 379', 'BNS 303', 'CrPC 436', 'BNSS 478', 'DEMO STATUTE REPOSITORY', 'v1.0-DEMO', NOW(), TRUE),
('55555555-1111-1111-1111-420111111111', 'Indian Penal Code', '420', 'Cheating and dishonestly inducing delivery of property', 'Whoever cheats and thereby dishonestly induces the person deceived to deliver any property... shall be punished with imprisonment for a term which may extend to seven years, and shall also be liable to fine.', 'Financial cheating or fraud carrying up to 7 years imprisonment. Non-bailable by default, subject to judicial discretion.', FALSE, 7, 'IPC 420', 'BNS 318', 'CrPC 437', 'BNSS 479', 'DEMO STATUTE REPOSITORY', 'v1.0-DEMO', NOW(), TRUE),
('55555555-1111-1111-1111-302111111111', 'Indian Penal Code', '302', 'Punishment for Murder', 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.', 'Severe offence of murder carrying life imprisonment or capital punishment. Non-bailable statutory classification.', FALSE, 20, 'IPC 302', 'BNS 103', 'CrPC 437', 'BNSS 479', 'DEMO STATUTE REPOSITORY', 'v1.0-DEMO', NOW(), TRUE);

-- Sample Case [DEMO DATA]
INSERT INTO cases (id, case_number, fir_number, police_station, offence_section, offence_type, maximum_sentence_years, custody_start_date, first_time_offender, residential_stability, employment_status, dependents, previous_court_appearances, previous_absconding, witness_tampering, co_accused, evidence_type, case_stage, surety_available, bond_ready, identification_ready, status, created_by_id, organization_id, created_at, updated_at)
VALUES (
    '66666666-1111-1111-1111-111111111111',
    'CASE-2026-001',
    'FIR-102/2026',
    'Central Station',
    '379',
    'Theft',
    3,
    CURRENT_DATE(),
    TRUE,
    TRUE,
    'EMPLOYED',
    2,
    3,
    FALSE,
    FALSE,
    FALSE,
    'DOCUMENTARY',
    'UNDER_INVESTIGATION',
    TRUE,
    TRUE,
    TRUE,
    'DRAFT',
    '33333333-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    NOW(),
    NOW()
);
