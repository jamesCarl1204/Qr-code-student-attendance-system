const { pool } = require('../config/db')
const { nowPH } = require('../utils/time')

const findSessionByCode = async (code) => {
    const [rows] = await pool.query(
        `SELECT s.id, s.class_id, s.session_date, s.class_start, s.class_end, s.late_after,
                c.subject_name, c.archived
           FROM attendance_sessions s
           JOIN classes c ON c.id = s.class_id
          WHERE s.attendance_code = ?`,
        [code]
    )
    return rows[0]
}

const isEnrolled = async (classId, studentId) => {
    const [rows] = await pool.query(
        `SELECT id FROM class_students
          WHERE class_id = ? AND student_id = ? AND left_at IS NULL AND removed_at IS NULL`,
        [classId, studentId]
    )
    return !!rows[0]
}

const createRecord = async ({ sessionId, studentId, status }) => {
    await pool.query(
        `INSERT INTO attendance_records (session_id, student_id, time_in, status)
         VALUES (?, ?, ?, ?)`,
        [sessionId, studentId, nowPH().time, status]
    )
}

const findStudentClass = async (classId, studentId) => {
    const [rows] = await pool.query(
        `SELECT c.id, c.subject_name AS subjectName, c.section, c.class_code AS classCode,
                c.color, c.archived = 1 AS archived,
                CONCAT(t.first_name, ' ', t.last_name) AS teacherName
           FROM class_students cs
           JOIN classes c ON c.id = cs.class_id
           JOIN teachers t ON t.id = c.teacher_id
          WHERE c.id = ? AND cs.student_id = ? AND cs.left_at IS NULL AND cs.removed_at IS NULL`,
        [classId, studentId]
    )
    return rows[0]
}

const findSessionsForStudent = async (classId, studentId) => {
    const [rows] = await pool.query(
        `SELECT s.id, s.session_date, s.class_start, s.class_end, s.late_after,
                r.status AS record_status, r.time_in
           FROM attendance_sessions s
           JOIN class_students cs ON cs.class_id = s.class_id AND cs.student_id = ?
           LEFT JOIN attendance_records r ON r.session_id = s.id AND r.student_id = ?
          WHERE s.class_id = ? AND s.session_date >= DATE(cs.joined_at)
          ORDER BY s.session_date DESC, s.class_start DESC`,
        [studentId, studentId, classId]
    )
    return rows
}

module.exports = {
    findSessionByCode, isEnrolled, createRecord, findStudentClass, findSessionsForStudent,
}