
const options = document.querySelector('.login-options')
const studentLoginForm = document.querySelector('.student-login-form')
const teacherLoginForm = document.querySelector('.teacher-login-form')
const registerForm = document.querySelector('.student-register')


const nameInput = document.getElementById('name-input')
const middlenameInput = document.getElementById('middlename-input')
const lastnameInput = document.getElementById('lastname-input')
const studentIdInput = document.getElementById('student-id')
const emailInput = document.getElementById('email-input')
const passwordInput = document.getElementById('password-input')
const confirmPasswordInput = document.getElementById('password-confirm')
const parentEmailInput = document.getElementById('parent-email')


const registerErrorElements = {
    name: null, 
    lastName: null,
    studentId: document.getElementById('id-err'),
    email: document.getElementById('email-err'),
    password: document.getElementById('password-err'),
    confirmPassword: document.getElementById('confirm-err'),
    parentEmail: document.getElementById('parent-email-err'),
}


const studentEmailInput = studentLoginForm.querySelector('input[type="email"]')
const studentPasswordInput = studentLoginForm.querySelector('input[type="password"]')
const studentLoginErrorElements = {
    email: document.getElementById('stud-email-err'),
    password: document.getElementById('stud-password-err'),
}


const teacherEmailInput = teacherLoginForm.querySelector('input[type="email"]')
const teacherPasswordInput = teacherLoginForm.querySelector('input[type="password"]')
const teacherLoginErrorElements = {
    email: document.getElementById('t-login-email-err'),
    password: document.getElementById('t-log-password-err'),
}


function showPanel(panel) {
    options.style.display = 'none'
    studentLoginForm.style.display = 'none'
    teacherLoginForm.style.display = 'none'
    registerForm.style.display = 'none'
    panel.style.display = panel === options ? 'flex' : 'flex'
}

document.querySelector('.student-login').addEventListener('click', () => showPanel(studentLoginForm))
document.querySelector('.teacher-login').addEventListener('click', () => showPanel(teacherLoginForm))
document.querySelector('#register-account a').addEventListener('click', () => showPanel(registerForm))

document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => showPanel(options))
})


function clearErrors(errorElements) {
    Object.values(errorElements).forEach(el => {
        if (el) el.textContent = ''
    })
}


function displayFirstError(errors, errorElements) {
    if (!errors || errors.length === 0) return
    const firstError = errors[0]
    const targetEl = errorElements[firstError.path]
    if (targetEl) {
        targetEl.textContent = firstError.msg
    }
}


registerForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    clearErrors(registerErrorElements)

    try {
        const response = await fetch('/api/student/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: nameInput.value,
                middleName: middlenameInput.value,
                lastName: lastnameInput.value,
                studentId: studentIdInput.value,
                email: emailInput.value,
                password: passwordInput.value,
                confirmPassword: confirmPasswordInput.value,
                parentEmail: parentEmailInput.value,
            }),
        })

        const data = await response.json()

        if (data.errors) {
            displayFirstError(data.errors, registerErrorElements)
            return
        }

        if (data.success) {
            alert('Registration successful! You can now log in.')
            window.location.href = '/'
        }
    } catch (err) {
        console.error(err)
    }
})


studentLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    clearErrors(studentLoginErrorElements)

    try {
        const response = await fetch('/student/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: studentEmailInput.value,
                password: studentPasswordInput.value,
            }),
        })

        const data = await response.json()

        if (!data.success) {
            if (data.errors) {
                displayFirstError(data.errors, studentLoginErrorElements)
            } else {
                studentLoginErrorElements.password.textContent = data.msg
            }
            return
        }

        window.location.href = '/student/dashboard'
    } catch (err) {
        console.error(err)
    }
})


teacherLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    clearErrors(teacherLoginErrorElements)

    try {
        const response = await fetch('/api/teacher/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: teacherEmailInput.value,
                password: teacherPasswordInput.value,
            }),
        })

        const data = await response.json()

        if (!data.success) {
            if (data.errors) {
                displayFirstError(data.errors, teacherLoginErrorElements)
            } else {
                teacherLoginErrorElements.password.textContent = data.msg
            }
            return
        }

        window.location.href = '/teacher/dashboard'
    } catch (err) {
        console.error(err)
    }
})