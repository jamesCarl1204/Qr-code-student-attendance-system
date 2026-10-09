const express = require('express')
const path = require('path')
const app = express()
const routes = require('./routes/authRoutes')


app.use(express.static('public'))
app.use(express.json())
app.use(routes)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
})
app.get('/student/dashboard', (req, res)=> {
    res.sendFile(path.join(__dirname, 'public/studentPortal', 'index.html'))
})
app.listen(3000)