-- ===========================================
-- CLEAN & UPDATED DATABASE FOR IT DEPT SYSTEM
-- ===========================================

-- WARNING: The script below will DROP the database if it exists (line commented).
-- Uncomment the DROP/CREATE lines if you want to recreate the database from scratch.

-- DROP DATABASE IF EXISTS college_db;
CREATE DATABASE IF NOT EXISTS college_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE college_db;

-- ============================================================
-- TABLE: programs
-- ============================================================
CREATE TABLE IF NOT EXISTS programs (
    program_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    level VARCHAR(50) NOT NULL,
    description TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: subjects
-- ============================================================
CREATE TABLE IF NOT EXISTS subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    code VARCHAR(30) NOT NULL,
    name VARCHAR(255) NOT NULL,
    semester SMALLINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_program_subject_code (program_id, code),
    INDEX idx_program_semester (program_id, semester),
    CONSTRAINT fk_subjects_program FOREIGN KEY (program_id)
        REFERENCES programs (program_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: admins
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    login_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: teachers
-- ============================================================
CREATE TABLE IF NOT EXISTS teachers (
    teacher_id INT AUTO_INCREMENT PRIMARY KEY,
    login_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: students
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    login_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    roll_no VARCHAR(50),
    semester SMALLINT,
    program_id INT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_student_program (program_id),
    CONSTRAINT fk_students_program FOREIGN KEY (program_id)
        REFERENCES programs (program_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: subject_teachers (mapping)
-- ============================================================
CREATE TABLE IF NOT EXISTS subject_teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    subject_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_teacher_subject (teacher_id, subject_id),
    INDEX idx_teacher (teacher_id),
    INDEX idx_subject (subject_id),
    CONSTRAINT fk_st_teacher FOREIGN KEY (teacher_id)
        REFERENCES teachers (teacher_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_st_subject FOREIGN KEY (subject_id)
        REFERENCES subjects (subject_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: schedules
-- ============================================================
CREATE TABLE IF NOT EXISTS schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    semester SMALLINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    title VARCHAR(255),
    uploaded_by VARCHAR(20),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_schedule_program_sem (program_id, semester),
    CONSTRAINT fk_schedules_program FOREIGN KEY (program_id)
        REFERENCES programs (program_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: notices
-- ============================================================
CREATE TABLE IF NOT EXISTS notices (
    notice_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    posted_by VARCHAR(20),
    INDEX idx_notices_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: events
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    last_date DATE,
    posted_by VARCHAR(20),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_events_last_date (last_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: job_updates
-- ============================================================
CREATE TABLE IF NOT EXISTS job_updates (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    company VARCHAR(255),
    apply_link VARCHAR(500),
    last_date DATE,
    posted_by VARCHAR(20),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_jobs_last_date (last_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: id_counter (login id generator)
-- ============================================================
CREATE TABLE IF NOT EXISTS id_counter (
    prefix VARCHAR(5) PRIMARY KEY,
    last_no INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed id_counter if not present
INSERT INTO id_counter (prefix, last_no)
SELECT '65', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM id_counter WHERE prefix='65');
INSERT INTO id_counter (prefix, last_no)
SELECT '70', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM id_counter WHERE prefix='70');
INSERT INTO id_counter (prefix, last_no)
SELECT '83', 0 FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM id_counter WHERE prefix='83');

-- ============================================================
-- TABLE: token_blocklist
-- ============================================================
CREATE TABLE IF NOT EXISTS token_blocklist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jti VARCHAR(255) NOT NULL,
    token_type VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NULL,
    INDEX idx_jti (jti)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- OPTIONAL: SEED DATA (uncomment to insert)
-- ============================================================

-- -- 1) PROGRAMS
-- INSERT INTO programs (code, name, duration, level, description) VALUES
-- ('BTECH_IT', 'B.Tech in Information Technology', '4 Years', 'Undergraduate', 'B.Tech program in IT.'),
-- ('MTECH_IT', 'M.Tech in Information Technology', '2 Years', 'Postgraduate', 'M.Tech program in IT.'),
-- ('MCA', 'Master of Computer Applications', '2 Years', 'Postgraduate', 'MCA program.'),
-- ('PHD_IT', 'Ph.D in Information Technology', '3-5 Years', 'Doctoral', 'PhD program in IT.');

-- -- 2) SUBJECTS
-- INSERT INTO subjects (program_id, code, name, semester) VALUES
-- (1, 'IT101', 'Programming in C', 1),
-- (1, 'IT102', 'Data Structures', 2),
-- (1, 'IT201', 'DBMS', 3),
-- (2, 'MT501', 'Advanced Algorithms', 1),
-- (3, 'MCA301', 'Web Technologies', 2);

-- -- 3) ADMINS
-- INSERT INTO admins (login_id, name, email, password) VALUES
-- ('65000001', 'Super Admin', 'admin@college.com', 'admin123');

-- -- 4) TEACHERS
-- INSERT INTO teachers (login_id, name, email, password, subject) VALUES
-- ('70000001', 'Alice Teacher', 'alice@college.com', 'pass1', 'Data Structures'),
-- ('70000002', 'Bob Teacher', 'bob@college.com', 'pass2', 'DBMS');

-- -- 5) STUDENTS
-- INSERT INTO students (login_id, name, email, password, roll_no, semester, program_id) VALUES
-- ('83000001', 'John Doe', 'john@college.com', '123', '21IT001', 1, 1),
-- ('83000002', 'Sara Smith', 'sara@college.com', '123', '21IT002', 2, 1),
-- ('83000003', 'Rahul Kumar', 'rahul@college.com', '123', '21MCA001', 1, 3);

-- -- 6) SUBJECT_TEACHERS
-- INSERT INTO subject_teachers (teacher_id, subject_id) VALUES
-- (1, 2),   -- Alice teaches Data Structures (IT102)
-- (2, 3);   -- Bob teaches DBMS (IT201)

-- -- 7) SCHEDULES (image-based)
-- INSERT INTO schedules (program_id, semester, image_url, title, uploaded_by) VALUES
-- (1, 1, '/static/schedules/btech_it_sem1.png', 'B.Tech IT - Sem 1 Schedule', '65000001'),
-- (1, 2, '/static/schedules/btech_it_sem2.png', 'B.Tech IT - Sem 2 Schedule', '65000001'),
-- (3, 1, '/static/schedules/mca_sem1.png', 'MCA - Sem 1 Schedule', '65000001');

-- -- 8) NOTICES
-- INSERT INTO notices (title, content, posted_by) VALUES
-- ('Welcome to IT Dept', 'New semester starts soon.', '70000001');

-- -- 9) EVENTS
-- INSERT INTO events (title, content, last_date, posted_by) VALUES
-- ('Tech Fest', 'Annual Technical Festival', '2025-03-01', '65000001');

-- -- 10) JOB UPDATES (with LAST_DATE)
-- INSERT INTO job_updates (title, description, company, apply_link, last_date, posted_by) VALUES
-- ('Internship at TCS', 'Hiring interns for summer batch', 'TCS', 'https://tcs.com/apply', '2025-04-15', '70000002'),
-- ('Junior Developer at Infosys', 'Entry-level full-time role for freshers.', 'Infosys', 'https://infosys.com/apply', '2024-12-01', '70000001');

-- ============================================================
-- END OF SCRIPT
-- ============================================================
