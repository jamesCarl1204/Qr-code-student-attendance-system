const { pool } = require('../config/db')

const findTeacherByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM teachers WHERE email = ?', [email])
    return rows[0]
}

module.exports = { findTeacherByEmail }