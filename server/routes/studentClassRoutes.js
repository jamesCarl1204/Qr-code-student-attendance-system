const { Router } = require('express')
const router = Router()
const { classes_get, join_post, leave_patch } = require('../controllers/studentClassController')
const { requireAuth } = require('../middleware/authMiddleware')

router.get('/api/student/classes', requireAuth('student'), classes_get)
router.post('/api/student/classes/join', requireAuth('student'), join_post)
router.patch('/api/student/classes/:id/leave', requireAuth('student'), leave_patch)

module.exports = router