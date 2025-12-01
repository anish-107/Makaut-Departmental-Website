-- ===========================================
-- CLEAN & FINAL DATABASE FOR IT DEPT SYSTEM
-- ===========================================

-- DROP DATABASE IF EXISTS college_db;
-- CREATE DATABASE college_db;
-- USE college_db;

-- -------------------------------------------
-- 1) PROGRAMS (BTech, MTech, MCA, PhD)
-- -------------------------------------------
-- CREATE TABLE programs (
--     program_id INT AUTO_INCREMENT PRIMARY KEY,
--     code VARCHAR(30) UNIQUE NOT NULL,
--     name VARCHAR(255) NOT NULL,
--     duration VARCHAR(50) NOT NULL,
--     level VARCHAR(50) NOT NULL,
--     description TEXT
-- );

-- -------------------------------------------
-- 2) SUBJECTS (per program, semester-wise)
-- -------------------------------------------
-- CREATE TABLE subjects (
--     subject_id INT AUTO_INCREMENT PRIMARY KEY,
--     program_id INT NOT NULL,
--     code VARCHAR(30) NOT NULL,
--     name VARCHAR(255) NOT NULL,
--     semester INT NOT NULL,
--     FOREIGN KEY(program_id) REFERENCES programs(program_id) ON DELETE CASCADE
-- );

-- -------------------------------------------
-- 3) ADMINS (login via ASCII-coded login_id)
-- -------------------------------------------
-- CREATE TABLE admins (
--     admin_id INT AUTO_INCREMENT PRIMARY KEY,
--     login_id VARCHAR(20) UNIQUE NOT NULL,
--     name VARCHAR(255),
--     email VARCHAR(255) UNIQUE,
--     password VARCHAR(255)
-- );

-- -------------------------------------------
-- 4) TEACHERS (login_id used for login)
-- -------------------------------------------
-- CREATE TABLE teachers (
--     teacher_id INT AUTO_INCREMENT PRIMARY KEY,
--     login_id VARCHAR(20) UNIQUE NOT NULL,
--     name VARCHAR(255) NOT NULL,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     subject VARCHAR(255)
-- );

-- -------------------------------------------
-- 5) STUDENTS (belong to a program)
-- -------------------------------------------
-- CREATE TABLE students (
--     student_id INT AUTO_INCREMENT PRIMARY KEY,
--     login_id VARCHAR(20) UNIQUE NOT NULL,
--     name VARCHAR(255) NOT NULL,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     roll_no VARCHAR(50),
--     semester INT,
--     program_id INT,
--     FOREIGN KEY(program_id) REFERENCES programs(program_id) ON DELETE SET NULL
-- );

-- -------------------------------------------
-- 6) TEACHER–SUBJECT MAPPING
-- -------------------------------------------
-- CREATE TABLE subject_teachers (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     teacher_id INT NOT NULL,
--     subject_id INT NOT NULL,
--     FOREIGN KEY(teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE,
--     FOREIGN KEY(subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE
-- );

-- -------------------------------------------
-- 7) SCHEDULES (timetable entries)
-- -------------------------------------------
-- CREATE TABLE schedules (
--     schedule_id INT AUTO_INCREMENT PRIMARY KEY,
--     subject_id INT NOT NULL,
--     teacher_id INT,
--     title VARCHAR(255),
--     location VARCHAR(255),
--     start_time DATETIME NOT NULL,
--     end_time DATETIME NOT NULL,
--     FOREIGN KEY(subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE,
--     FOREIGN KEY(teacher_id) REFERENCES teachers(teacher_id) ON DELETE SET NULL
-- );

-- -------------------------------------------
-- 8) NOTICES
-- -------------------------------------------
-- CREATE TABLE notices (
--     notice_id INT AUTO_INCREMENT PRIMARY KEY,
--     title VARCHAR(255),
--     content TEXT,
--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--     posted_by VARCHAR(20)
-- );

-- -------------------------------------------
-- 9) EVENTS
-- -------------------------------------------
-- CREATE TABLE events (
--     event_id INT AUTO_INCREMENT PRIMARY KEY,
--     title VARCHAR(255),
--     content TEXT,
--     last_date DATETIME,
--     posted_by VARCHAR(20),
--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
-- );

-- -------------------------------------------
-- 10) JOB UPDATES
-- -------------------------------------------
-- CREATE TABLE job_updates (
--     job_id INT AUTO_INCREMENT PRIMARY KEY,
--     title VARCHAR(255),
--     description TEXT,
--     company VARCHAR(255),
--     apply_link VARCHAR(500),
--     posted_by VARCHAR(20),
--     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
-- );

-- -------------------------------------------
-- 11) LOGIN-ID COUNTER (simple safe ID generator)
-- -------------------------------------------
-- CREATE TABLE id_counter (
--     prefix VARCHAR(5) PRIMARY KEY,
--     last_no INT NOT NULL
-- );

-- INSERT INTO id_counter VALUES
-- ('65', 0),   -- Admin (A)
-- ('70', 0),   -- Teacher (F)
-- ('83', 0);   -- Student (S)

-- DONE


-- USE college_db;

-- -- -------------------------------------------
-- -- 1) PROGRAMS
-- -- -------------------------------------------
-- INSERT INTO programs (code, name, duration, level)
-- VALUES
-- ('BTECH_IT', 'B.Tech in Information Technology', '4 Years', 'Undergraduate'),
-- ('MTECH_IT', 'M.Tech in Information Technology', '2 Years', 'Postgraduate'),
-- ('MCA', 'Master of Computer Applications', '2 Years', 'Postgraduate'),
-- ('PHD_IT', 'Ph.D in Information Technology', '3-5 Years', 'Doctoral');

-- -- -------------------------------------------
-- -- 2) SUBJECTS
-- -- -------------------------------------------
-- INSERT INTO subjects (program_id, code, name, semester)
-- VALUES
-- (1, 'IT101', 'Programming in C', 1),
-- (1, 'IT102', 'Data Structures', 2),
-- (1, 'IT201', 'DBMS', 3),
-- (2, 'MT501', 'Advanced Algorithms', 1),
-- (3, 'MCA301', 'Web Technologies', 2);

-- -- -------------------------------------------
-- -- 3) ADMINS
-- -- -------------------------------------------
-- INSERT INTO admins (login_id, name, email, password)
-- VALUES
-- ('65000001', 'Super Admin', 'admin@college.com', 'admin123');

-- -- -------------------------------------------
-- -- 4) TEACHERS
-- -- -------------------------------------------
-- INSERT INTO teachers (login_id, name, email, password, subject)
-- VALUES
-- ('70000001', 'Alice Teacher', 'alice@college.com', 'pass1', 'Data Structures'),
-- ('70000002', 'Bob Teacher', 'bob@college.com', 'pass2', 'DBMS');

-- -- -------------------------------------------
-- -- 5) STUDENTS
-- -- -------------------------------------------
-- INSERT INTO students (login_id, name, email, password, roll_no, semester, program_id)
-- VALUES
-- ('83000001', 'John Doe', 'john@college.com', '123', '21IT001', 1, 1),
-- ('83000002', 'Sara Smith', 'sara@college.com', '123', '21IT002', 2, 1),
-- ('83000003', 'Rahul Kumar', 'rahul@college.com', '123', '21MCA001', 1, 3);

-- -- -------------------------------------------
-- -- 6) TEACHER → SUBJECT ASSIGNMENTS
-- -- -------------------------------------------
-- INSERT INTO subject_teachers (teacher_id, subject_id)
-- VALUES
-- (1, 2),   -- Alice teaches Data Structures
-- (2, 3);   -- Bob teaches DBMS

-- -- -------------------------------------------
-- -- 7) SCHEDULES
-- -- -------------------------------------------
-- INSERT INTO schedules (subject_id, teacher_id, title, location, start_time, end_time)
-- VALUES
-- (2, 1, 'DSA Lecture', 'Room 101', '2025-01-15 10:00:00', '2025-01-15 11:00:00'),
-- (3, 2, 'DBMS Lecture', 'Room 102', '2025-01-15 11:00:00', '2025-01-15 12:00:00');

-- -- -------------------------------------------
-- -- 8) NOTICES
-- -- -------------------------------------------
-- INSERT INTO notices (title, content, posted_by)
-- VALUES
-- ('Welcome to IT Dept', 'New semester starts soon.', '70000001');

-- -- -------------------------------------------
-- -- 9) EVENTS
-- -- -------------------------------------------
-- INSERT INTO events (title, content, last_date, posted_by)
-- VALUES
-- ('Tech Fest', 'Annual Technical Festival', '2025-03-01', '65000001');

-- -- -------------------------------------------
-- -- 10) JOB UPDATES
-- -- -------------------------------------------
-- INSERT INTO job_updates (title, description, company, apply_link, posted_by)
-- VALUES
-- ('Internship at TCS', 'Hiring interns for summer batch', 'TCS', 'https://tcs.com/apply', '70000002');

