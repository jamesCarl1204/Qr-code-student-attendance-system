const { pool } = require('../config/db')

const findByEmail = async (email) => {
    const [ rows ] = await pool.query('SELECT * FROM students WHERE email = ?', [email]);
    return rows[0]
}

const createStudent = async (data) => {
    const [result] = await pool.query(
    `INSERT INTO students (first_name, middle_name, last_name, student_id_num, email, password, parent_email)
    VALUES(?, ?, ? ,? ,? ,?, ?)`,
    [data.name, data.middleName, data.lastName, data.studentId, data.email, data.hashedPassword, data.parentEmail]
    );
    return result.insertId
}


module.exports = [ findByEmail, createStudent]