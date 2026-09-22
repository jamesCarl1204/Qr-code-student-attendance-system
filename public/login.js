const options = document.querySelector('.login-options')
const studentForm = document.querySelector('.student-login-form')
const teacherForm = document.querySelector('.teacher-login-form')
const registerForm = document.querySelector('.student-register')

document.querySelector('.student-login').addEventListener('click', () => {
    options.style.display = "none"
    studentForm.style.display = 'flex'
})

document.querySelector('.teacher-login').addEventListener('click', () => {
    options.style.display = "none"
    teacherForm.style.display = "flex"
})

document.querySelector('#register-account a').addEventListener('click', () => {
    options.style.display = 'none'
    registerForm.style.display = 'flex'
})

document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        studentForm.style.display ='none'
        teacherForm.style.display = 'none'
        registerForm.style.display = 'none'
        options.style.display = 'flex'
    })
})