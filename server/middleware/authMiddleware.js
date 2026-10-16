const jwt = require('jsonwebtoken')

const requireAuth = (role) => (req, res, next) => {
    const token = req.cookies.jwt
    if (!token) return res.status(401).json({ success: false, msg: 'Not logged in' })

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ success: false, msg: 'Invalid or expired session' })
        if (role && decoded.role !== role) {
            return res.status(403).json({ success: false, msg: 'Forbidden' })
        }
        req.user = decoded
        next()
    })
}

module.exports = { requireAuth }