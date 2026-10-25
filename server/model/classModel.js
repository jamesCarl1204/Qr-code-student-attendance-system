const crypto = require('crypto')
const { pool } = require('../config/db')

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const genCode = (len = 6) =>
    Array.from(crypto.randomBytes(len), (b) => ALPHABET[b % ALPHABET.length]).join('')

const findClassesByTeacher = async (teacherId) => {
    const [rows] = await pool.query(
        `SELECT c.id, c.subject_name AS subjectName, c.section, c.class_code AS classCode,
                c.color, c.archived = 1 AS archived, c.created_at AS createdAt,
                COUNT(cs.id) AS studentCount
         FROM classes c
         LEFT JOIN class_students cs
                ON cs.class_id = c.id AND cs.left_at IS NULL AND cs.removed_at IS NULL
         WHERE c.teacher_id = ?
         GROUP BY c.id
         ORDER BY c.created_at DESC`,
        [teacherId]
    )
    return rows
}

const createClass = async ({ teacherId, subjectName, section, color }) => {
    for (let i = 0; i < 5; i++) {
        const classCode = genCode()
        try {
            const [r] = await pool.query(
                `INSERT INTO classes (teacher_id, subject_name, section, class_code, color)
                 VALUES (?, ?, ?, ?, ?)`,
                [teacherId, subjectName, section, classCode, color]
            )
            return { id: r.insertId, classCode }
        } catch (err) {
            if (err.code !== 'ER_DUP_ENTRY') throw err
        }
    }
    throw new Error('Could not generate a unique class code')
}

const findOwnedClass = async (id, teacherId) => {
    const [rows] = await pool.query(
        'SELECT id FROM classes WHERE id = ? AND teacher_id = ?',
        [id, teacherId]
    )
    return rows[0]
}

const setArchived = async (id, teacherId, archived) => {
    const [r] = await pool.query(
        'UPDATE classes SET archived = ? WHERE id = ? AND teacher_id = ?',
        [archived ? 1 : 0, id, teacherId]
    )
    return r.affectedRows > 0
}

const hasActivity = async (classId) => {
    const [rows] = await pool.query(
        `SELECT (SELECT COUNT(*) FROM class_students WHERE class_id = ?) AS students,
                (SELECT COUNT(*) FROM attendance_sessions WHERE class_id = ?) AS sessions`,
        [classId, classId]
    )
    return rows[0].students > 0 || rows[0].sessions > 0
}

const deleteClass = async (id, teacherId) => {
    await pool.query('DELETE FROM classes WHERE id = ? AND teacher_id = ?', [id, teacherId])
}

module.exports = {
    findClassesByTeacher, createClass, findOwnedClass, setArchived, hasActivity, deleteClass,
}