const modal = document.getElementById('auth-modal')
const modalTitle = document.getElementById('modal-title')
const modalSubtitle = document.getElementById('modal-subtitle')
const modalToggleText = document.getElementById('modal-toggle-text')

const studentLoginForm = document.getElementById('student-login-form')
const teacherLoginForm = document.getElementById('teacher-login-form')
const studentRegisterForm = document.getElementById('student-register-form')

let currentRole = 'student'   
let currentMode = 'login'

const studEmailInput = document.getElementById('stud-email')
const studPasswordInput = document.getElementById('stud-password')
const studentLoginErrorElements = {
    email: document.getElementById('stud-email-err'),
    password: document.getElementById('stud-password-err'),
}

const teacherEmailInput = document.getElementById('t-login-email')
const teacherPasswordInput = document.getElementById('t-login-password')
const teacherLoginErrorElements = {
    email: document.getElementById('t-login-email-err'),
    password: document.getElementById('t-log-password-err'),
}

const nameInput = document.getElementById('name-input')
const middlenameInput = document.getElementById('middlename-input')
const lastnameInput = document.getElementById('lastname-input')
const studentIdInput = document.getElementById('student-id')
const emailInput = document.getElementById('email-input')
const passwordInput = document.getElementById('password-input')
const confirmPasswordInput = document.getElementById('password-confirm')
const parentEmailInput = document.getElementById('parent-email')

const registerErrorElements = {
    studentId: document.getElementById('id-err'),
    email: document.getElementById('email-err'),
    password: document.getElementById('password-err'),
    confirmPassword: document.getElementById('confirm-err'),
    parentEmail: document.getElementById('parent-email-err'),
}

function openModal(role) {
    currentRole = role
    currentMode = 'login'
    updateModalUI()
    modal.classList.remove('hidden')
}

function closeModal() {
    modal.classList.add('hidden')
}

function toggleMode() {
    currentMode = currentMode === 'login' ? 'register' : 'login'
    updateModalUI()
}

function updateModalUI() {
    studentLoginForm.classList.add('hidden')
    teacherLoginForm.classList.add('hidden')
    studentRegisterForm.classList.add('hidden')

    if (currentRole === 'student' && currentMode === 'login') {
        modalTitle.textContent = 'Student Sign In'
        modalSubtitle.textContent = 'Enter your student credentials'
        studentLoginForm.classList.remove('hidden')
        modalToggleText.innerHTML = `New student? <button type="button" id="toggle-mode-btn">Register here</button>`
    } else if (currentRole === 'student' && currentMode === 'register') {
        modalTitle.textContent = 'Student Registration'
        modalSubtitle.textContent = 'Enter your details & parent contact'
        studentRegisterForm.classList.remove('hidden')
        modalToggleText.innerHTML = `Already have an account? <button type="button" id="toggle-mode-btn">Sign in here</button>`
    } else if (currentRole === 'teacher') {
        modalTitle.textContent = 'Teacher Sign In'
        modalSubtitle.textContent = 'Enter your faculty credentials'
        teacherLoginForm.classList.remove('hidden')
        modalToggleText.innerHTML = ''
    }

    const toggleBtn = document.getElementById('toggle-mode-btn')
    if (toggleBtn) toggleBtn.addEventListener('click', toggleMode)
}


document.getElementById('hero-student').addEventListener('click', () => openModal('student'))
document.getElementById('hero-teacher').addEventListener('click', () => openModal('teacher'))
document.getElementById('close-modal').addEventListener('click', closeModal)

function clearErrors(errorElements) {
    Object.values(errorElements).forEach(el => {
        if (el) el.textContent = ''
    })
}

function displayFirstError(errors, errorElements) {
    if (!errors || errors.length === 0) return
    const firstError = errors[0]
    const targetEl = errorElements[firstError.path]
    if (targetEl) targetEl.textContent = firstError.msg
}

studentRegisterForm.addEventListener('submit', async (e) => {
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
            currentMode = 'login'
            updateModalUI()
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
                email: studEmailInput.value,
                password: studPasswordInput.value,
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