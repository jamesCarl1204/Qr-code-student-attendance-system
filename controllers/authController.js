const {pool} =require('../config/db')
const {body, validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const rateLimit = require('express-rate-limit') 
const jwt = require('jsonwebtoken')

const registerValidationRules = [
    body('studentId').isLength({min:8}).withMessage('student Id should be 8'),
    body('email').isEmail().withMessage('please Enter a valid Email'),
    body('password').isLength({min:8}).withMessage('password should be at least 8 characters'),
]

const loginValidationRules = [
    body('email').trim().isEmail().withMessage('please Enter a valid email')
]

const maxAge = 30 * 24 * 60 * 60;

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {success: false, message: 'too many attemps. Please try again later'}
})

function createToken(id) {
    return jwt.sign({id}, 'secret', {expiresIn: maxAge})
}

const register_post = async (req,res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({success: false, errors: errors.array()})
    }

    const {name, middleName, lastName, studentId, email, password,confirmPassword, parentEmail} = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM students WHERE email = ?', [email])

        if(rows.length > 0) {
            return res.status(400).json({success:false, errors:[{path:'email', msg: 'email already exist'}]})
        }

        if(password !== confirmPassword) {
           return  res.status(400).json({success: false, errors: [{path: 'confirmPassword', msg:'password do not match' }]})
        }

        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt)

        const [result] = await pool.query('INSERT INTO students (name, middle_name, last_name, student_id, email, hashedPassword, parent_email) VALUES(?,?,?,?,?,?,?)',[name,middleName,lastName, studentId, email, password, parentEmail])
        const token = createToken(result.insertId)

        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge})
        res.status(201).json({user: result.insertId})

    } catch(err) {
        console.log(err)
    }

}

module.exports = {register_post, registerValidationRules}