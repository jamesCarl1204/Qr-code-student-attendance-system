import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStyle from '../hooks/useStyle'
import css from '../styles/landing.module.css?inline'

const emptyReg = {
  name: '',
  middleName: '',
  lastName: '',
  studentId: '',
  email: '',
  password: '',
  confirmPassword: '',
  parentEmail: '',
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

function firstError(errors) {
  if (!errors || errors.length === 0) return {}
  return { [errors[0].path]: errors[0].msg }
}

export default function Landing() {
 // useStyle(css)
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [role, setRole] = useState('student')
  const [mode, setMode] = useState('login')

  const [studLogin, setStudLogin] = useState({ email: '', password: '' })
  const [studLoginErr, setStudLoginErr] = useState({})

  const [teachLogin, setTeachLogin] = useState({ email: '', password: '' })
  const [teachLoginErr, setTeachLoginErr] = useState({})

  const [reg, setReg] = useState(emptyReg)
  const [regErr, setRegErr] = useState({})

  const openModal = (r) => {
    setRole(r)
    setMode('login')
    setOpen(true)
  }

  const toggleMode = () => setMode((m) => (m === 'login' ? 'register' : 'login'))

  const onReg = (field) => (e) => setReg((p) => ({ ...p, [field]: e.target.value }))

  const submitStudentLogin = async (e) => {
    e.preventDefault()
    setStudLoginErr({})
    try {
      const data = await postJson('/student/login', studLogin)
      if (!data.success) {
        setStudLoginErr(data.errors ? firstError(data.errors) : { password: data.msg })
        return
      }
      navigate('/student/dashboard')
    } catch (err) {
      console.error(err)
    }
  }

  const submitTeacherLogin = async (e) => {
    e.preventDefault()
    setTeachLoginErr({})
    try {
      const data = await postJson('/api/teacher/login', teachLogin)
      if (!data.success) {
        setTeachLoginErr(data.errors ? firstError(data.errors) : { password: data.msg })
        return
      }
      navigate('/teacher/dashboard')
    } catch (err) {
      console.error(err)
    }
  }

  const submitRegister = async (e) => {
    e.preventDefault()
    setRegErr({})
    try {
      const data = await postJson('/api/student/register', reg)
      if (data.errors) {
        setRegErr(firstError(data.errors))
        return
      }
      if (data.success) {
        alert('Registration successful! You can now log in.')
        setReg(emptyReg)
        setMode('login')
      }
    } catch (err) {
      console.error(err)
    }
  }

  let title = 'Student Sign In'
  let subtitle = 'Enter your student credentials'
  if (role === 'student' && mode === 'register') {
    title = 'Student Registration'
    subtitle = 'Enter your details & parent contact'
  } else if (role === 'teacher') {
    title = 'Teacher Sign In'
    subtitle = 'Enter your faculty credentials'
  }

  return (
    <>
      <div className="app">
        <header className="topnav">
          <div className="brand">
            <div className="logo-box">QR</div>
            <div className="brand-text">
              <h1>Regis Marie College</h1>
              <p>QR Attendance Monitoring</p>
            </div>
          </div>
        </header>

        <main className="landing">
          <div className="hero-copy">
            <h2>Fast, Accurate QR-Based Attendance.</h2>
            <p>
              Scan in seconds, keep parents informed automatically, and give teachers real-time
              attendance visibility.
            </p>
          </div>

          <div className="hero-options">
            <button className="hero-card" onClick={() => openModal('student')}>
              <div className="hero-icon">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <div className="hero-text">
                <h3>Student Access</h3>
                <p>View your digital QR pass and attendance records.</p>
              </div>
            </button>

            <button className="hero-card" onClick={() => openModal('teacher')}>
              <div className="hero-icon">
                <i className="fa-solid fa-chalkboard-user"></i>
              </div>
              <div className="hero-text">
                <h3>Teacher Portal</h3>
                <p>Run live QR scanning and manage class rosters.</p>
              </div>
            </button>
          </div>
        </main>
      </div>

      <div className={`modal-overlay${open ? '' : ' hidden'}`}>
        <div className="modal-card">
          <div className="modal-header">
            <div className="brand">
              <div className="logo-box">QR</div>
              <div className="brand-text">
                <h3>{title}</h3>
                <p>{subtitle}</p>
              </div>
            </div>
            <button type="button" className="icon-btn" onClick={() => setOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* STUDENT LOGIN */}
          <form
            className={`modal-form${role === 'student' && mode === 'login' ? '' : ' hidden'}`}
            onSubmit={submitStudentLogin}
          >
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email..."
              required
              value={studLogin.email}
              onChange={(e) => setStudLogin((p) => ({ ...p, email: e.target.value }))}
            />
            <div className="err">{studLoginErr.email}</div>

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password..."
              required
              value={studLogin.password}
              onChange={(e) => setStudLogin((p) => ({ ...p, password: e.target.value }))}
            />
            <div className="err">{studLoginErr.password}</div>

            <button type="submit">Sign In</button>
          </form>

          {/* TEACHER LOGIN */}
          <form
            className={`modal-form${role === 'teacher' ? '' : ' hidden'}`}
            onSubmit={submitTeacherLogin}
          >
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email..."
              required
              value={teachLogin.email}
              onChange={(e) => setTeachLogin((p) => ({ ...p, email: e.target.value }))}
            />
            <div className="err">{teachLoginErr.email}</div>

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password..."
              required
              value={teachLogin.password}
              onChange={(e) => setTeachLogin((p) => ({ ...p, password: e.target.value }))}
            />
            <div className="err">{teachLoginErr.password}</div>

            <button type="submit">Sign In</button>
          </form>

          {/* STUDENT REGISTER */}
          <form
            className={`modal-form${role === 'student' && mode === 'register' ? '' : ' hidden'}`}
            onSubmit={submitRegister}
          >
            <div className="grid-2">
              <div>
                <label>Student ID</label>
                <input
                  placeholder="Enter student ID..."
                  required
                  value={reg.studentId}
                  onChange={onReg('studentId')}
                />
                <div className="err">{regErr.studentId}</div>
              </div>
              <div>
                <label>First Name</label>
                <input
                  placeholder="Enter name..."
                  required
                  value={reg.name}
                  onChange={onReg('name')}
                />
              </div>
            </div>

            <div className="grid-2">
              <div>
                <label>Middle Name</label>
                <input
                  placeholder="Optional"
                  value={reg.middleName}
                  onChange={onReg('middleName')}
                />
              </div>
              <div>
                <label>Last Name</label>
                <input
                  placeholder="Enter lastname..."
                  required
                  value={reg.lastName}
                  onChange={onReg('lastName')}
                />
              </div>
            </div>

            <label>Student Email</label>
            <input
              type="email"
              placeholder="Enter email..."
              required
              value={reg.email}
              onChange={onReg('email')}
            />
            <div className="err">{regErr.email}</div>

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password..."
              required
              value={reg.password}
              onChange={onReg('password')}
            />
            <div className="err">{regErr.password}</div>

            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password..."
              required
              value={reg.confirmPassword}
              onChange={onReg('confirmPassword')}
            />
            <div className="err">{regErr.confirmPassword}</div>

            <label>Parent's Email</label>
            <input
              type="email"
              placeholder="Parent/guardian email..."
              required
              value={reg.parentEmail}
              onChange={onReg('parentEmail')}
            />
            <div className="err">{regErr.parentEmail}</div>

            <button type="submit">Create Student Account</button>
          </form>

          <div className="modal-footer">
            {role === 'student' && mode === 'login' && (
              <p>
                New student?{' '}
                <button type="button" onClick={toggleMode}>
                  Register here
                </button>
              </p>
            )}
            {role === 'student' && mode === 'register' && (
              <p>
                Already have an account?{' '}
                <button type="button" onClick={toggleMode}>
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}