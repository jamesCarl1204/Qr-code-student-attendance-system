const express = require('express')
const cookieParser = require('cookie-parser')
const routes = require('./routes/authRoutes')
const classRoutes = require('./routes/classRoutes')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(routes)
app.use(classRoutes)

app.listen(3000, () => console.log('Server running on :3000'))