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
const studentId = document.getElementById('student-id')

const idErr = document.getElementById('id-err')
const regEmailErr = document.getElementById('email-err')
const regPasswordErr = document.getElementById('password-err')
const regConfirmErr = document.getElementById('confirm-err')
const regParentEmailErr = document.getElementById('parent-email-err')

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

        regEmailErr.textContent = ''
        regPasswordErr.textContent = ''
        idErr.textContent = ''
        regConfirmErr.textContent = ''


    const nameVal = name.value;
    const middleNameVal = middlename.value;
    const lastNameVal = lastname.value;
    const emailVal = email.value;
    const passwordVal = password.value;
    const confirmPasswordVal= confirmPassword.value;
    const parentEmailVal = parentEmail.value;
    const studentIdVal = studentId.value

    try {
    const response = await fetch('/api/student/register', {

        
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            name: nameVal,
            middleName:middleNameVal,
            lastName: lastNameVal,
            studentId: studentIdVal,
            email: emailVal,
            password: passwordVal,
            confirmPassword: confirmPasswordVal,
            parentEmail: parentEmailVal,
        })
    })

    const data = await response.json(); 
       
    if(data.errors) {
        
        data.errors.forEach(err => {
            if(err.path === 'email') regEmailErr.textContent = err.msg
            if(err.path === 'password') regPasswordErr.textContent = err.msg
            if(err.path === 'studentId') idErr.textContent = err.msg
            if(err.path === 'confirmPassword') regConfirmErr.textContent = err.msg
        })
    }
} 
catch(err) {
    console.log(err)
}
    
})
