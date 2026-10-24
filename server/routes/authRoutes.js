const { Router } = require('express')
const router = Router()
const { check_get, register_post, logout_post, registerValidationRules, loginLimiter, loginValidationRules, login_post} = require('../controllers/authController')
const {requireAuth} = require('../middleware/authMiddleware')


router.get('/api/check', requireAuth(), check_get)
router.post('/api/student/register', registerValidationRules, register_post)
router.post('/api/student/login', loginLimiter, loginValidationRules, login_post)
router.post('/api/logout', logout_post)

module.exports = router