const { Router } = require('express')
const router = Router()
const { register_post, registerValidationRules, loginLimiter, loginValidationRules, login_post} = require('../controllers/authController')


router.post('/api/student/register', registerValidationRules, register_post)

router.post('/student/login', loginLimiter, loginValidationRules, login_post)
module.exports = router