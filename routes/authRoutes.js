const { Router } = require('express')
const router = Router()
const { register_post, registerValidationRules } = require('../controllers/authController')

router.post('/api/student/register',registerValidationRules, register_post)
//router.post('/login')
//router.get('/logout')

module.exports = router