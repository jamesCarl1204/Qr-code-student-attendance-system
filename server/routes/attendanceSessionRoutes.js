const { Router } = require('express')
const router = Router()
const {
    createSessionRules, class_get, sessions_get, session_post, session_qr_get,
} = require('../controllers/attendanceSessionController')
const { requireAuth } = require('../middleware/authMiddleware')

router.get('/api/teacher/classes/:id', requireAuth('teacher'), class_get)
router.get('/api/teacher/classes/:id/sessions', requireAuth('teacher'), sessions_get)
router.post('/api/teacher/classes/:id/sessions', requireAuth('teacher'), createSessionRules, session_post)
router.get('/api/teacher/sessions/:id/qr', requireAuth('teacher'), session_qr_get)

module.exports = router