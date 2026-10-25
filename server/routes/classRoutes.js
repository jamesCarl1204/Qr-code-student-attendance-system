const { Router } = require('express')
const router = Router()
const c = require('../controllers/classController')
const { requireAuth } = require('../middleware/authMiddleware')

router.get('/api/teacher/classes', requireAuth('teacher'), c.classes_get)
router.post('/api/teacher/classes', requireAuth('teacher'), c.createClassRules, c.class_post)
router.patch('/api/teacher/classes/:id/archive', requireAuth('teacher'), c.idRule, c.archiveRules, c.class_archive_patch)
router.delete('/api/teacher/classes/:id', requireAuth('teacher'), c.idRule, c.class_delete)

module.exports = router