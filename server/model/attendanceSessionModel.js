const { pool } = require('../config/db')

const SESSION_COLUMNS =
    'id, class_id, session_date, class_start, class_end, late_after, attendance_code, created_at'

const findOwnedClassDetail = async (classId, teacherId) => {
    const [rows] = await pool.query(
        `SELECT id, subject_name, section, class_code, color, archived
           FROM classes WHERE id = ? AND teacher_id = ?`,
        [classId, teacherId]
    )
    return rows[0]
}

const findSessionsByClass = async (classId) => {
    const [rows] = await pool.query(
        `SELECT ${SESSION_COLUMNS} FROM attendance_sessions
          WHERE class_id = ?
          ORDER BY session_date DESC, class_start DESC`,
        [classId]
    )
    return rows
}

const findSessionById = async (id) => {
    const [rows] = await pool.query(
        `SELECT ${SESSION_COLUMNS} FROM attendance_sessions WHERE id = ?`,
        [id]
    )
    return rows[0]
}

const createSession = async ({ classId, sessionDate, classStart, classEnd, lateAfter, attendanceCode }) => {
    const [result] = await pool.query(
        `INSERT INTO attendance_sessions
            (class_id, session_date, class_start, class_end, late_after, attendance_code)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [classId, sessionDate, classStart, classEnd, lateAfter, attendanceCode]
    )
    return result.insertId
}

const findOwnedSession = async (sessionId, teacherId) => {
    const [rows] = await pool.query(
        `SELECT s.id, s.session_date, s.class_start, s.class_end, s.attendance_code
           FROM attendance_sessions s
           JOIN classes c ON c.id = s.class_id
          WHERE s.id = ? AND c.teacher_id = ?`,
        [sessionId, teacherId]
    )
    return rows[0]
}

module.exports = {
    findOwnedClassDetail, findSessionsByClass, findSessionById, createSession, findOwnedSession,
}