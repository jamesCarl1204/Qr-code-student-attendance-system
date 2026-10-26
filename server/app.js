const express = require('express')
const cookieParser = require('cookie-parser')
const routes = require('./routes/authRoutes')
const classRoutes = require('./routes/classRoutes')
const attendanceSessionRoutes = require('./routes/attendanceSessionRoutes')
const studentClassRoutes = require('./routes/studentClassRoutes')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(routes)
app.use(classRoutes)
app.use(attendanceSessionRoutes)
app.use(studentClassRoutes)

app.listen(3000, () => console.log('Server running on :3000'))