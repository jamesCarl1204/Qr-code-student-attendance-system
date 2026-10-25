const { body, param, validationResult } = require('express-validator')
const model = require('../model/classModel')

const COLORS = ['blue', 'indigo', 'green', 'red', 'orange', 'purple', 'pink', 'slate']

const createClassRules = [
    body('subjectName').trim().notEmpty().withMessage('Subject name is required')
        .isLength({ max: 150 }).withMessage('Max 150 characters'),
    body('section').optional({ values: 'falsy' }).trim()
        .isLength({ max: 150 }).withMessage('Max 150 characters'),
    body('color').optional().isIn(COLORS).withMessage('Invalid color'),
]
const idRule = [param('id').isInt({ min: 1 }).withMessage('Invalid class id')]
const archiveRules = [body('archived').isBoolean().withMessage('archived must be true or false')]

const sendErrors = (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) return false
    res.status(400).json({ success: false, errors: errors.array() })
    return true
}
const fail = (res, err) => {
    console.error(err)
    res.status(500).json({ success: false, msg: 'Something went wrong. Please try again.' })
}

const classes_get = async (req, res) => {
    try {
        const classes = await model.findClassesByTeacher(req.user.id)
        res.json({ success: true, classes })
    } catch (err) { fail(res, err) }
}

const class_post = async (req, res) => {
    if (sendErrors(req, res)) return
    const { subjectName, section, color } = req.body
    try {
        const created = await model.createClass({
            teacherId: req.user.id,
            subjectName,
            section: section || null,
            color: color || 'blue',
        })
        res.status(201).json({ success: true, class: created })
    } catch (err) { fail(res, err) }
}

const class_archive_patch = async (req, res) => {
    if (sendErrors(req, res)) return
    try {
        const ok = await model.setArchived(req.params.id, req.user.id, req.body.archived)
        if (!ok) return res.status(404).json({ success: false, msg: 'Class not found' })
        res.json({ success: true })
    } catch (err) { fail(res, err) }
}

const class_delete = async (req, res) => {
    if (sendErrors(req, res)) return
    try {
        const owned = await model.findOwnedClass(req.params.id, req.user.id)
        if (!owned) return res.status(404).json({ success: false, msg: 'Class not found' })
        if (await model.hasActivity(owned.id)) {
            return res.status(409).json({
                success: false,
                msg: 'This class already has students or sessions. Archive it instead.',
            })
        }
        await model.deleteClass(owned.id, req.user.id)
        res.json({ success: true })
    } catch (err) { fail(res, err) }
}

module.exports = {
    createClassRules, idRule, archiveRules,
    classes_get, class_post, class_archive_patch, class_delete,
}