const { pool } = require('../config/db')

const findStudentClasses = async (studentId) => {
    const [rows] = await pool.query(
        `SELECT c.id, c.subject_name AS subjectName, c.section, c.class_code AS classCode,
                c.color, c.archived = 1 AS archived,
                CONCAT(t.first_name, ' ', t.last_name) AS teacherName,
                cs.joined_at AS joinedAt
           FROM class_students cs
           JOIN classes c ON c.id = cs.class_id
           JOIN teachers t ON t.id = c.teacher_id
          WHERE cs.student_id = ? AND cs.left_at IS NULL AND cs.removed_at IS NULL
          ORDER BY cs.joined_at DESC`,
        [studentId]
    )
    return rows
}

const findClassByCode = async (code) => {
    const [rows] = await pool.query(
        'SELECT id, subject_name, section, archived FROM classes WHERE class_code = ?',
        [code]
    )
    return rows[0]
}

const findEnrollment = async (classId, studentId) => {
    const [rows] = await pool.query(
        'SELECT id, left_at, removed_at FROM class_students WHERE class_id = ? AND student_id = ?',
        [classId, studentId]
    )
    return rows[0]
}

const enroll = async (classId, studentId) => {
    await pool.query(
        'INSERT INTO class_students (class_id, student_id) VALUES (?, ?)',
        [classId, studentId]
    )
}

const rejoin = async (enrollmentId) => {
    await pool.query(
        'UPDATE class_students SET left_at = NULL, joined_at = NOW() WHERE id = ?',
        [enrollmentId]
    )
}

const leave = async (classId, studentId) => {
    const [result] = await pool.query(
        `UPDATE class_students SET left_at = NOW()
          WHERE class_id = ? AND student_id = ? AND left_at IS NULL AND removed_at IS NULL`,
        [classId, studentId]
    )
    return result.affectedRows
}

module.exports = { findStudentClasses, findClassByCode, findEnrollment, enroll, rejoin, leave }