const { Router } = require('express')
const router = Router()

router.post('/register')
router.post('/login')
router.get('/logout')

module.exports = router