import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import s from '../Landing.module.css'
import StudentLoginForm from './StudentLoginForm'
import TeacherLoginForm from './TeacherLoginForm'
import RegisterForm from './RegisterForm'

export default function AuthModal({ open, role, onClose }) {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')

  // balik sa login tuwing magbubukas ulit
  useEffect(() => {
    if (open) setMode('login')
  }, [open, role])

  if (!open) return null

  const toggleMode = () => setMode((m) => (m === 'login' ? 'register' : 'login'))

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
    <div className={s['modal-overlay']}>
      <div className={s['modal-card']}>
        <div className={s['modal-header']}>
          <div className={s.brand}>
            <div className={s['logo-box']}>
              <i className={`fa-solid ${role === 'teacher' ? 'fa-qrcode' : 'fa-camera'}`}></i>
            </div>
            <div className={s['brand-text']}>
              <h3>{title}</h3>
              <p>{subtitle}</p>
            </div>
          </div>
          <button type="button" className={s['icon-btn']} onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {role === 'teacher' && <TeacherLoginForm onSuccess={() => navigate('/teacher/dashboard')} />}

        {role === 'student' && mode === 'login' && (
          <StudentLoginForm onSuccess={() => navigate('/student/dashboard')} />
        )}

        {role === 'student' && mode === 'register' && (
          <RegisterForm onRegistered={() => setMode('login')} />
        )}

        <div className={s['modal-footer']}>
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
  )
}