import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'
import useToast from '../components/Toasts'
import s from '../styles/student.module.css'

export default function StudentPortal() {
  const navigate = useNavigate()
  const { showToast, toastContainer } = useToast()

  const [tab, setTab] = useState('classes')
  const [joinOpen, setJoinOpen] = useState(false)
  const [classCode, setClassCode] = useState('')
  const [manualCode, setManualCode] = useState('')

  const scannerRef = useRef(null)

  const stopScanner = async () => {
    const sc = scannerRef.current
    if (sc && sc.isScanning) {
      try {
        await sc.stop()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const startScanner = async () => {
    await stopScanner()
    scannerRef.current = new Html5Qrcode('reader')
    try {
      await scannerRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 200, height: 200 } },
        (decodedText) => {
          showToast(`Scanned: ${decodedText}`, 'success')
          stopScanner()
        }
      )
    } catch {
      showToast('Cannot access camera', 'error')
    }
  }

  useEffect(() => {
    if (tab !== 'scan') stopScanner()
  }, [tab])

  useEffect(() => {
    return () => {
      stopScanner()
    }
  }, [])

  const openJoin = () => setJoinOpen(true)

  const submitJoin = (e) => {
    e.preventDefault()
    const code = classCode.trim()
    if (!code) return
    setJoinOpen(false)
    setClassCode('')
    showToast(`Join request for ${code.toUpperCase()}`, 'info')
  }

  const submitManual = () => {
    const code = manualCode.trim()
    if (!code) return
    showToast(`Code submitted: ${code}`, 'info')
    setManualCode('')
  }

  const show = (name) => ({ display: tab === name ? 'block' : 'none' })

  const navItems = [
    { key: 'classes', icon: 'fa-book-open', label: 'Classes' },
    { key: 'archived', icon: 'fa-box-archive', label: 'Archived Class' },
    { key: 'scan', icon: 'fa-qrcode', label: 'Scan' },
  ]

  return (
    <div className={s.root}>
      <nav className={s.navbar}>
        <div className={s['navbar-brand']}>
          <div className={s.avatar}>SP</div>
          <div>
            <h1 className={s['user-name']}>Student Name</h1>
            <p className={s['user-id']}>Student ID: --------</p>
          </div>
        </div>

        <div className={s['navbar-actions']}>
          <button className={`${s.btn} ${s['btn-primary']}`} onClick={openJoin}>
            <i className="fa-solid fa-plus"></i> Join Class
          </button>
          <button className={`${s.btn} ${s['btn-ghost']}`} onClick={() => navigate('/')}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </nav>

      <div className={s.layout}>
        <aside className={s.sidebar}>
          <ul className={s['sidebar-menu']}>
            {navItems.map((item) => (
              <li
                key={item.key}
                className={`${s['sidebar-item']} ${tab === item.key ? s.active : ''}`}
                onClick={() => setTab(item.key)}
              >
                <i className={`fa-solid ${item.icon}`}></i>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>

          <div className={s['sidebar-status']}>
            <p className={s['sidebar-status-title']}>Attendance Ready</p>
            <p className={s['sidebar-status-text']}>No active attendance tokens detected.</p>
          </div>
        </aside>

        <main className={s['main-content']}>
          <section className={s.view} style={show('classes')}>
            <div className={s['view-header']}>
              <div>
                <h2>Classes</h2>
                <p className={s['view-subtitle']}>Enrolled courses and attendance logs.</p>
              </div>
            </div>

            <div className={s['class-grid']}>
              <div className={s['empty-state']}>
                <div className={s['empty-icon']}>
                  <i className="fa-solid fa-book-open"></i>
                </div>
                <div>
                  <h3>No classes enrolled yet</h3>
                  <p>
                    You are not currently enrolled in any classes. Use "Join Class" above to get
                    started.
                  </p>
                </div>
                <button className={`${s.btn} ${s['btn-primary']}`} onClick={openJoin}>
                  Join a Class Now
                </button>
              </div>
            </div>
          </section>

          <section className={s.view} style={show('archived')}>
            <div className={s['view-header']}>
              <div>
                <h2>Archived Class</h2>
                <p className={s['view-subtitle']}>Previous semester or completed courses.</p>
              </div>
            </div>

            <div className={s['class-grid']}>
              <div className={s['empty-state']}>
                <div className={s['empty-icon']}>
                  <i className="fa-solid fa-box-archive"></i>
                </div>
                <div>
                  <h3>No archived classes</h3>
                  <p>Archived courses from past terms will appear here.</p>
                </div>
              </div>
            </div>
          </section>

          <section className={`${s.view} ${s['view-narrow']}`} style={show('scan')}>
            <div className={s['view-header']}>
              <div>
                <h2>QR Scanner</h2>
                <p className={s['view-subtitle']}>Scan event or class check-in codes.</p>
              </div>
            </div>

            <div className={s['scan-card']}>
              <div className={s['camera-box']}>
                <div id="reader"></div>
              </div>
              <button className={`${s.btn} ${s['btn-primary']}`} onClick={startScanner}>
                <i className="fa-solid fa-camera"></i> Start Scanning
              </button>

              <div className={s['manual-checkin']}>
                <label htmlFor="scan-code-input">Manual Code Check-in</label>
                <div className={s['manual-row']}>
                  <input
                    type="text"
                    id="scan-code-input"
                    className={`${s.input} ${s['input-mono']}`}
                    placeholder="Enter session or check-in code..."
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                  />
                  <button className={`${s.btn} ${s['btn-primary']}`} onClick={submitManual}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <div className={`${s['modal-overlay']} ${joinOpen ? s.active : ''}`}>
        <div className={s['modal-card']}>
          <div className={s['modal-head']}>
            <div className={s['modal-title-wrap']}>
              <div className={`${s.avatar} ${s['avatar-sm']}`}>JC</div>
              <div>
                <h3>Join a Class</h3>
                <p>Enter class code provided by instructor</p>
              </div>
            </div>
            <button className={s['icon-btn']} aria-label="Close" onClick={() => setJoinOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form className={s['join-form']} onSubmit={submitJoin}>
            <label htmlFor="class-code-input">Class Code</label>
            <input
              type="text"
              id="class-code-input"
              className={`${s.input} ${s['input-mono']} ${s['input-upper']}`}
              placeholder="e.g. CS-301-2026"
              required
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
            />
            <button type="submit" className={`${s.btn} ${s['btn-primary']} ${s['btn-block']}`}>
              Join Class
            </button>
          </form>
        </div>
      </div>

      {toastContainer}
    </div>
  )
}