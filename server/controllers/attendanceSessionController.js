const crypto = require('crypto')
const QRCode = require('qrcode')
const { body, validationResult } = require('express-validator')
const model = require('../model/attendanceSessionModel')
const { nowPH, sessionStatus } = require('../utils/time')

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

const createSessionRules = [
    body('sessionDate')
        .isDate({ format: 'YYYY-MM-DD', strictMode: true }).withMessage('Enter a valid date'),
    body('classStart')
        .matches(TIME_RE).withMessage('Start time is required'),
    body('classEnd')
        .matches(TIME_RE).withMessage('End time is required').bail()
        .custom((value, { req }) => {
            if (TIME_RE.test(req.body.classStart) && value <= req.body.classStart) {
                throw new Error('End time must be after start time')
            }
            return true
        }),
    body('lateAfter')
        .matches(TIME_RE).withMessage('Late-after time is required').bail()
        .custom((value, { req }) => {
            const { classStart, classEnd } = req.body
            if (TIME_RE.test(classStart) && value < classStart) {
                throw new Error('Late-after cannot be before start time')
            }
            if (TIME_RE.test(classEnd) && value > classEnd) {
                throw new Error('Late-after cannot be after end time')
            }
            return true
        }),
]

const generateAttendanceCode = () => {
    let code = ''
    for (let i = 0; i < 6; i++) code += CODE_CHARS[crypto.randomInt(CODE_CHARS.length)]
    return code
}

const parseId = (value) => (/^\d+$/.test(value) ? Number(value) : null)

const fail = (res, err) => {
    console.error(err)
    res.status(500).json({ success: false, msg: 'Something went wrong. Please try again.' })
}

const notFound = (res, what) => res.status(404).json({ success: false, msg: `${what} not found` })

// GET /api/teacher/classes/:id
const class_get = async (req, res) => {
    const classId = parseId(req.params.id)
    if (!classId) return notFound(res, 'Class')
    try {
        const cls = await model.findOwnedClassDetail(classId, req.user.id)
        if (!cls) return notFound(res, 'Class')
        res.json({ success: true, class: cls })
    } catch (err) { fail(res, err) }
}

// GET /api/teacher/classes/:id/sessions
const sessions_get = async (req, res) => {
    const classId = parseId(req.params.id)
    if (!classId) return notFound(res, 'Class')
    try {
        const cls = await model.findOwnedClassDetail(classId, req.user.id)
        if (!cls) return notFound(res, 'Class')
        const now = nowPH()
        const rows = await model.findSessionsByClass(classId)
        const sessions = rows.map((r) => ({ ...r, status: sessionStatus(r, now) }))
        res.json({ success: true, sessions })
    } catch (err) { fail(res, err) }
}

// POST /api/teacher/classes/:id/sessions
const session_post = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() })
    }

    const classId = parseId(req.params.id)
    if (!classId) return notFound(res, 'Class')

    const { sessionDate, classStart, classEnd, lateAfter } = req.body

    try {
        const cls = await model.findOwnedClassDetail(classId, req.user.id)
        if (!cls) return notFound(res, 'Class')
        if (cls.archived) {
            return res.status(409).json({ success: false, msg: 'This class is archived. Restore it first.' })
        }

        for (let attempt = 0; attempt < 5; attempt++) {
            try {
                const id = await model.createSession({
                    classId,
                    sessionDate,
                    classStart,
                    classEnd,
                    lateAfter,
                    attendanceCode: generateAttendanceCode(),
                })
                const session = await model.findSessionById(id)
                return res.status(201).json({
                    success: true,
                    session: { ...session, status: sessionStatus(session) },
                })
            } catch (err) {
                if (err.code !== 'ER_DUP_ENTRY') throw err
            }
        }
        res.status(500).json({ success: false, msg: 'Could not generate a session code. Try again.' })
    } catch (err) { fail(res, err) }
}

// GET /api/teacher/sessions/:id/qr
const session_qr_get = async (req, res) => {
    const sessionId = parseId(req.params.id)
    if (!sessionId) return notFound(res, 'Session')
    try {
        const session = await model.findOwnedSession(sessionId, req.user.id)
        if (!session) return notFound(res, 'Session')
        const qr = await QRCode.toDataURL(session.attendance_code, {
            errorCorrectionLevel: 'M',
            width: 320,
            margin: 2,
        })
        res.json({ success: true, code: session.attendance_code, qr })
    } catch (err) { fail(res, err) }
}

module.exports = { createSessionRules, class_get, sessions_get, session_post, session_qr_get }