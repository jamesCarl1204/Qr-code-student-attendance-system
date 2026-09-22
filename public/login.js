const options = document.querySelector('.login-options')
const studentForm = document.querySelector('.student-login-form')
const teacherForm = document.querySelector('.teacher-login-form')
const registerForm = document.querySelector('.student-register')

const registerBtn = document.getElementById('register-btn')
const name = document.getElementById('name-input')
const middlename= document.getElementById('middlename-input')
const lastname = document.getElementById('lastname-input')
const email = document.getElementById('email-input')
const password = document.getElementById('password-input')
const confirmPassword = document.getElementById('password-confirm')
const parentEmail = document.getElementById('parent-email')



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

registerBtn.addEventListener('click', async (e) => {

    e.preventDefault()

    const nameVal = name.value;
    const middleNameVal = middlename.value;
    const lastNameVal = lastname.value;
    const emailVal = email.value;
    const passwordVal = password.value;
    const confirmPasswordVal= confirmPassword.value;
    const parentEmailVal = parentEmail.value;

    const response = fetch('/register', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            name: nameVal,
            middleName:middleNameVal,
            lastName: lastNameVal,
            email: emailVal,
            password: passwordVal,
            confirmPassword: confirmPasswordVal,
            parentEmail: parentEmailVal
        })
    })

    const data = response.json();
    
})
