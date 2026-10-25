-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- 2. Users Table (Base table for login/RBAC)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Administrator', 'Registry', 'Finance', 'Lecturer', 'Student', 'Alumni')),
    name VARCHAR(255) NOT NULL
);

-- 3. Students Table (1:1 with users, 1:M with departments)
CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(50) PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    department_id INT NOT NULL REFERENCES departments(id),
    email VARCHAR(255) NOT NULL UNIQUE,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 4. Lecturers Table (1:1 with users, 1:M with departments)
CREATE TABLE IF NOT EXISTS lecturers (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    department_id INT NOT NULL REFERENCES departments(id)
);

-- 5. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department_id INT NOT NULL REFERENCES departments(id),
    credits INT NOT NULL,
    lecturer_id INT REFERENCES lecturers(id)
);

-- Course Prerequisites (Self-referencing mapping table for M:M)
CREATE TABLE IF NOT EXISTS course_prerequisites (
    course_id VARCHAR(50) REFERENCES courses(id) ON DELETE CASCADE,
    prerequisite_id VARCHAR(50) REFERENCES courses(id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, prerequisite_id)
);

-- 6. Enrollments (Resolves M:M between students and courses)
CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    course_id VARCHAR(50) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'Enrolled',
    grade VARCHAR(2),
    grade_points DECIMAL(3,2),
    UNIQUE(student_id, course_id) -- Prevent duplicate enrollment
);

-- 7. Ledger / Payments Table (Tracks Student Financials)
CREATE TABLE IF NOT EXISTS ledger (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Tuition', 'Payment')),
    amount DECIMAL(10,2) NOT NULL, -- Negative for Tuition (debt), Positive for Payment (credit)
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description VARCHAR(255)
);

-- ==========================================
-- DUMMY DATA FOR TESTING
-- ==========================================

-- Insert Departments
INSERT INTO departments (id, name) VALUES (1, 'Computer Science') ON CONFLICT DO NOTHING;
INSERT INTO departments (id, name) VALUES (2, 'Business Administration') ON CONFLICT DO NOTHING;

-- Insert Users
INSERT INTO users (id, username, password_hash, role, name) VALUES 
(1, 'admin', 'hash', 'Administrator', 'System Admin'),
(2, 'registry', 'hash', 'Registry', 'Sarah Registry'),
(3, 'finance', 'hash', 'Finance', 'John Finance'),
(4, 'lecturer1', 'hash', 'Lecturer', 'Dr. Alan Math'),
(5, 'student1', 'hash', 'Student', 'Jane Doe'),
(6, 'student2', 'hash', 'Student', 'John Smith'),
(7, 'alumni1', 'hash', 'Alumni', 'Graduated George')
ON CONFLICT DO NOTHING;

-- Insert Students
INSERT INTO students (student_id, user_id, department_id, email, enrollment_date) VALUES 
('S001', 5, 1, 'jane@univ.edu', '2025-01-10'),
('S002', 6, 2, 'john@univ.edu', '2025-01-15')
ON CONFLICT DO NOTHING;

-- Insert Lecturers
INSERT INTO lecturers (id, user_id, department_id) VALUES 
(1, 4, 1)
ON CONFLICT DO NOTHING;

-- Insert Courses
INSERT INTO courses (id, name, department_id, credits, lecturer_id) VALUES 
('CS101', 'Intro to Programming', 1, 3, 1),
('CS102', 'Data Structures', 1, 4, 1),
('BA101', 'Intro to Business', 2, 3, NULL)
ON CONFLICT DO NOTHING;

-- Insert Prerequisites
INSERT INTO course_prerequisites (course_id, prerequisite_id) VALUES 
('CS102', 'CS101')
ON CONFLICT DO NOTHING;

-- Insert Ledger (Initial Tuitions)
INSERT INTO ledger (student_id, type, amount, description) VALUES 
('S001', 'Tuition', -5000.00, 'Semester 1 Tuition'),
('S001', 'Payment', 2000.00, 'Initial Deposit'),
('S002', 'Tuition', -5000.00, 'Semester 1 Tuition'),
('S002', 'Payment', 5000.00, 'Full Payment');
