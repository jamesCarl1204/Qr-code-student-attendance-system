const { pool } = require('../config/db')

const findByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM students WHERE email = ?', [email])
    return rows[0]
}

const findByStudentIdNumber = async (idNumber) => {
    const [rows] = await pool.query('SELECT id FROM students WHERE student_id_number = ?', [idNumber])
    return rows[0]
}

const findStudentById = async (id) => {
    const [rows] = await pool.query(
        'SELECT id, first_name, last_name, student_id_number FROM students WHERE id = ?',
        [id]
    )
    return rows[0]
}

const createStudent = async (data) => {
    const [result] = await pool.query(
        `INSERT INTO students (first_name, middle_name, last_name, student_id_number, email, password, parent_email)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [data.name, data.middleName || null, data.lastName, data.studentId, data.email, data.hashedPassword, data.parentEmail]
    )
    return result.insertId
}

module.exports = { findByEmail, findByStudentIdNumber, findStudentById, createStudent }