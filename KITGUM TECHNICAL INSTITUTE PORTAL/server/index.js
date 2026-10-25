const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Initial State / Bootstrap Endpoint
app.get('/api/bootstrap', async (req, res) => {
    try {
        const users = await pool.query('SELECT id, username, role, name FROM users');
        const students = await pool.query('SELECT * FROM students');
        const departments = await pool.query('SELECT * FROM departments');
        
        // Fetch courses with their prerequisites
        const coursesResult = await pool.query(`
            SELECT c.*, array_remove(array_agg(cp.prerequisite_id), NULL) as prerequisites 
            FROM courses c
            LEFT JOIN course_prerequisites cp ON c.id = cp.course_id
            GROUP BY c.id
        `);
        
        const enrollments = await pool.query('SELECT * FROM enrollments');
        const ledger = await pool.query('SELECT * FROM ledger ORDER BY id ASC');

        res.json({
            users: users.rows,
            students: students.rows,
            departments: departments.rows,
            courses: coursesResult.rows,
            enrollments: enrollments.rows,
            ledger: ledger.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 2. Login Endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await pool.query('SELECT id, username, role, name FROM users WHERE username = $1', [username]);
        
        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Invalid username" });
        }
        
        let userData = user.rows[0];
        
        if (userData.role === 'Student') {
            const student = await pool.query('SELECT student_id FROM students WHERE user_id = $1', [userData.id]);
            if (student.rows.length > 0) userData.student_id = student.rows[0].student_id;
        } else if (userData.role === 'Lecturer') {
            const lecturer = await pool.query('SELECT id as lecturer_id FROM lecturers WHERE user_id = $1', [userData.id]);
            if (lecturer.rows.length > 0) userData.lecturer_id = lecturer.rows[0].lecturer_id;
        }

        res.json(userData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 3. ATOMIC TRANSACTION: Course Registration (The "Anti-Error" Guard)
app.post('/api/enroll', async (req, res) => {
    const { student_id, course_id } = req.body;
    
    // Acquire a client from the pool to run a transaction
    const client = await pool.connect();
    
    try {
        // BEGIN TRANSACTION
        await client.query('BEGIN');
        
        // Lock the ledger rows for this student to prevent concurrent modifications during balance check
        const balanceResult = await client.query(`
            SELECT SUM(amount) as total_balance 
            FROM ledger 
            WHERE student_id = $1 
            FOR UPDATE
        `, [student_id]);
        
        const balance = balanceResult.rows[0].total_balance || 0;
        const ALLOWED_DEBT = -1000.00;

        // GUARD 1: Financial Clearance
        if (balance < ALLOWED_DEBT) {
            throw new Error(`Registration Denied: Outstanding balance is $${Math.abs(balance)}. You must clear your debt.`);
        }

        // GUARD 2: Prerequisite Check
        const course = await client.query(`
            SELECT prerequisite_id FROM course_prerequisites WHERE course_id = $1
        `, [course_id]);
        
        if (course.rows.length > 0) {
            const prereqs = course.rows.map(r => r.prerequisite_id);
            const passedResult = await client.query(`
                SELECT course_id FROM enrollments 
                WHERE student_id = $1 AND course_id = ANY($2) AND grade NOT IN ('F', 'D')
            `, [student_id, prereqs]);
            
            if (passedResult.rows.length < prereqs.length) {
                throw new Error("Registration Denied: Prerequisites not met.");
            }
        }

        // INSERT Enrollment
        const newEnrollment = await client.query(`
            INSERT INTO enrollments (student_id, course_id, status) 
            VALUES ($1, $2, 'Enrolled') RETURNING *
        `, [student_id, course_id]);

        // COMMIT TRANSACTION
        await client.query('COMMIT');
        res.json(newEnrollment.rows[0]);

    } catch (err) {
        // ROLLBACK TRANSACTION ON ANY ERROR
        await client.query('ROLLBACK');
        console.error("Transaction Rolled Back:", err.message);
        
        if (err.code === '23505') { // Postgres Unique Violation code
            res.status(400).json({ error: "Already enrolled in this course." });
        } else {
            res.status(400).json({ error: err.message });
        }
    } finally {
        client.release();
    }
});

// 4. Payment Endpoint
app.post('/api/pay', async (req, res) => {
    try {
        const { student_id, amount, description } = req.body;
        const newPayment = await pool.query(`
            INSERT INTO ledger (student_id, type, amount, description)
            VALUES ($1, 'Payment', $2, $3) RETURNING *
        `, [student_id, parseFloat(amount), description]);
        
        res.json(newPayment.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 5. Submit Grade Endpoint
app.post('/api/grades', async (req, res) => {
    try {
        const { enrollment_id, grade } = req.body;
        const gradePointsMap = { 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 };
        const points = gradePointsMap[grade] || 0.0;

        const updated = await pool.query(`
            UPDATE enrollments SET grade = $1, grade_points = $2
            WHERE id = $3 RETURNING *
        `, [grade, points, enrollment_id]);

        res.json(updated.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 6. Admissions Endpoint (Profile Creation)
app.post('/api/admit', async (req, res) => {
    const { first_name, last_name, email, department_id } = req.body;
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Generate generic username (e.g., first.last)
        const username = `${first_name.toLowerCase()}.${last_name.toLowerCase()}`;
        const name = `${first_name} ${last_name}`;
        
        // Insert User
        const userResult = await client.query(`
            INSERT INTO users (username, password_hash, role, name)
            VALUES ($1, 'default_hash', 'Student', $2) RETURNING id
        `, [username, name]);
        
        const userId = userResult.rows[0].id;
        
        // Generate Student ID (mock logic: S + padded user_id)
        const studentId = `S${String(userId).padStart(3, '0')}`;
        
        // Insert Student
        const studentResult = await client.query(`
            INSERT INTO students (student_id, user_id, department_id, email, enrollment_date)
            VALUES ($1, $2, $3, $4, CURRENT_DATE) RETURNING *
        `, [studentId, userId, department_id]);
        
        await client.query('COMMIT');
        
        res.json({
            user_id: userId,
            student_id: studentId,
            name,
            email,
            department_id
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).json({ error: "Failed to admit student: " + err.message });
    } finally {
        client.release();
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`USRMS Database Backend Server running on port ${PORT}`);
});
