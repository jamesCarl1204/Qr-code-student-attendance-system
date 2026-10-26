const model = require('../model/studentClassModel')

const fail = (res, err) => {
    console.error(err)
    res.status(500).json({ success: false, msg: 'Something went wrong. Please try again.' })
}

const msg = (res, status, text) => res.status(status).json({ success: false, msg: text })

const classes_get = async (req, res) => {
    try {
        const classes = await model.findStudentClasses(req.user.id)
        res.json({ success: true, classes })
    } catch (err) { fail(res, err) }
}

const join_post = async (req, res) => {
    const code = String(req.body.classCode || '').trim().toUpperCase()
    if (!code || code.length > 20) return msg(res, 400, 'Enter a valid class code')

    try {
        const cls = await model.findClassByCode(code)
        if (!cls) return msg(res, 404, 'Class not found. Check the code and try again.')
        if (cls.archived) return msg(res, 409, 'This class is archived and no longer accepts students.')

        const existing = await model.findEnrollment(cls.id, req.user.id)
        if (existing) {
            if (existing.removed_at) return msg(res, 403, 'You were removed from this class. Please contact your teacher.')
            if (!existing.left_at) return msg(res, 409, 'You already joined this class.')
            await model.rejoin(existing.id)
        } else {
            await model.enroll(cls.id, req.user.id)
        }

        res.status(201).json({
            success: true,
            class: { id: cls.id, subjectName: cls.subject_name, section: cls.section },
        })
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return msg(res, 409, 'You already joined this class.')
        fail(res, err)
    }
}

const leave_patch = async (req, res) => {
    if (!/^\d+$/.test(req.params.id)) return msg(res, 404, 'Class not found')
    try {
        const changed = await model.leave(Number(req.params.id), req.user.id)
        if (!changed) return msg(res, 404, 'You are not enrolled in this class')
        res.json({ success: true })
    } catch (err) { fail(res, err) }
}

module.exports = { classes_get, join_post, leave_patch }