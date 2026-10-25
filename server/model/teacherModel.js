const { pool } = require('../config/db')

const findTeacherByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM teachers WHERE email = ?', [email])
    return rows[0]
}

const findTeacherById = async (id) => {
    const [rows] = await pool.query(
        'SELECT id, first_name, last_name, teacher_id_number, role FROM teachers WHERE id = ?',
        [id]
    )
    return rows[0]
}

module.exports = { findTeacherByEmail, findTeacherById }