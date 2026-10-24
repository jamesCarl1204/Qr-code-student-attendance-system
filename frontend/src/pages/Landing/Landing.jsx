import { useState } from 'react'
import s from './Landing.module.css'
import AuthModal from './components/AuthModal'
import logo from '../../assets/100.png'

export default function Landing() {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState('student')

  const openModal = (r) => {
    setRole(r)
    setOpen(true)
  }

  return (
    <div className={s.root}>
      <header className={s.topnav}>
        <div className={s.inner}>
          <div className={s.brand}>
            <div className={s['logo-box']}>
              <img className={s.img} src={logo} alt="Regis Marie College logo" />
            </div>
            <div className={s['brand-text']}>
              <h1>
                Regis Marie <span className={s.badge}>COLLEGE</span>
              </h1>
              <p>QR Attendance Monitoring</p>
            </div>
          </div>
        </div>
      </header>

      <main className={s.landing}>
        <div className={s['hero-copy']}>
          <h2>
            Fast, Accurate <span className={s.accent}>QR-Based</span> Attendance.
          </h2>
          <p>
            Scan in seconds, keep parents informed automatically, and give teachers real-time
            class attendance visibility.
          </p>
        </div>

        <div className={s.cards}>
          <button className={s.card} onClick={() => openModal('student')}>
            <div className={`${s['card-icon']} ${s['icon-student']}`}>
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <div className={s['card-title']}>
              <h3>Student Access</h3>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
            <p className={s['card-desc']}>
              Scan your teacher's QR code to check in, view subject logs, and track your
              attendance history.
            </p>
            <div className={`${s['card-footer']} ${s['footer-student']}`}>
              <span>Student Portal</span>
              <i className="fa-solid fa-camera"></i>
            </div>
          </button>

          <button className={`${s.card} ${s['card-teacher']}`} onClick={() => openModal('teacher')}>
            <div className={`${s['card-icon']} ${s['icon-teacher']}`}>
              <i className="fa-solid fa-chalkboard-user"></i>
            </div>
            <div className={s['card-title']}>
              <h3>Teacher Portal</h3>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
            <p className={s['card-desc']}>
              Generate class QR codes, manage class rosters, and view real-time attendance
              reports.
            </p>
            <div className={`${s['card-footer']} ${s['footer-teacher']}`}>
              <span>Live Classroom</span>
              <i className="fa-solid fa-qrcode"></i>
            </div>
          </button>
        </div>
      </main>

      <AuthModal open={open} role={role} onClose={() => setOpen(false)} />
    </div>
  )
}