const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const [findByEmail, createStudent ] = require('../model/studentModel');

const MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
const SALT_ROUNDS = 12; // 


const registerValidationRules = [
    body('name').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('studentId').trim().isLength({ min: 8, max: 8 }).withMessage('Student ID must be exactly 8 digits'),
    body('email').trim().isEmail().normalizeEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) throw new Error('Passwords do not match');
        return true;
    }),
    body('parentEmail').trim().isEmail().normalizeEmail().withMessage('Enter a valid parent/guardian email'),
];

const loginValidationRules = [
    body('email').trim().isEmail().normalizeEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
];

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, msg: 'Too many login attempts. Try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});


function createToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: MAX_AGE_SECONDS });
}


const register_post = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, middleName, lastName, studentId, email, password, parentEmail } = req.body;

    try {
        const existing = await findByEmail(email);
        if (existing) {
            return res.status(409).json({
                success: false,
                errors: [{ path: 'email', msg: 'Email already registered' }],
            });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const studentId_db = await createStudent({
            name, middleName, lastName, studentId, email, hashedPassword, parentEmail,
        });

        const token = createToken({ id: studentId_db, role: 'student' });

        res.cookie('jwt', token, {
            httpOnly: true,          
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',      
            maxAge: MAX_AGE_SECONDS * 1000,
        });

        res.status(201).json({ success: true, msg: 'Account created successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Something went wrong. Please try again.' });
    }
};


const login_post = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const student = await findByEmail(email);

        if (!student) {
            return res.status(401).json({ success: false, msg: 'Invalid email or password' });
        }

        const match = await bcrypt.compare(password, student.password);
        if (!match) {
            return res.status(401).json({ success: false, msg: 'Invalid email or password' });
        }

        const token = createToken({ id: student.id, role: 'student' });

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: MAX_AGE_SECONDS * 1000,
        });

        res.status(200).json({ success: true, msg: 'Logged in successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, msg: 'Something went wrong. Please try again.' });
    }
};

module.exports = {
    register_post,
    login_post,
    registerValidationRules,
    loginValidationRules,
    loginLimiter,
};