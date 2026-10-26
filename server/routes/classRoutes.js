const { Router } = require('express')
const router = Router()
const { classes_get, join_post, leave_patch } = require('../controllers/studentClassController')
const { checkin_post, class_sessions_get } = require('../controllers/studentAttendanceController')
const { requireAuth } = require('../middleware/authMiddleware')

router.get('/api/student/classes', requireAuth('student'), classes_get)
router.post('/api/student/classes/join', requireAuth('student'), join_post)
router.patch('/api/student/classes/:id/leave', requireAuth('student'), leave_patch)
router.get('/api/student/classes/:id/sessions', requireAuth('student'), class_sessions_get)
router.post('/api/student/attendance/check-in', requireAuth('student'), checkin_post)

module.exports = router