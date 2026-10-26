const model = require('../model/studentAttendanceModel')
const { nowPH, sessionStatus } = require('../utils/time')

const fail = (res, err) => {
    console.error(err)
    res.status(500).json({ success: false, msg: 'Something went wrong. Please try again.' })
}
const msg = (res, status, text) => res.status(status).json({ success: false, msg: text })

// POST /api/student/attendance/check-in  { code }
const checkin_post = async (req, res) => {
    const code = String(req.body.code || '').trim().toUpperCase()
    if (!code || code.length > 20) return msg(res, 400, 'Enter a valid code')

    try {
        const session = await model.findSessionByCode(code)
        if (!session) return msg(res, 404, 'Invalid code. Check and try again.')

        if (!(await model.isEnrolled(session.class_id, req.user.id))) {
            return msg(res, 403, 'You are not enrolled in this class.')
        }

        const now = nowPH()
        const state = sessionStatus(session, now)
        if (state === 'Upcoming') return msg(res, 409, 'This session has not started yet.')
        if (state === 'Ended') return msg(res, 409, 'This session has already ended.')

        const status = now.time > session.late_after ? 'Late' : 'Present'
        await model.createRecord({ sessionId: session.id, studentId: req.user.id, status })

        res.status(201).json({ success: true, status, subjectName: session.subject_name })
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return msg(res, 409, 'You already checked in for this session.')
        fail(res, err)
    }
}

// GET /api/student/classes/:id/sessions
const class_sessions_get = async (req, res) => {
    if (!/^\d+$/.test(req.params.id)) return msg(res, 404, 'Class not found')
    const classId = Number(req.params.id)
    try {
        const cls = await model.findStudentClass(classId, req.user.id)
        if (!cls) return msg(res, 404, 'Class not found')

        const now = nowPH()
        const rows = await model.findSessionsForStudent(classId, req.user.id)
        const sessions = rows.map((r) => {
            const state = sessionStatus(r, now)
            let status
            if (r.record_status) status = r.record_status
            else if (state === 'Ended') status = 'Absent'
            else if (state === 'Ongoing') status = 'Not checked in'
            else status = 'Upcoming'
            return {
                id: r.id,
                sessionDate: r.session_date,
                classStart: r.class_start,
                classEnd: r.class_end,
                lateAfter: r.late_after,
                timeIn: r.time_in,
                status,
            }
        })
        res.json({ success: true, class: cls, sessions })
    } catch (err) { fail(res, err) }
}

module.exports = { checkin_post, class_sessions_get }