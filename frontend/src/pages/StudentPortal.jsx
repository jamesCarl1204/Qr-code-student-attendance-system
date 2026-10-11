import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'
import useStyle from '../hooks/useStyle'
import useToast from '../components/Toasts'
import css from '../styles/student.css?inline'

export default function StudentPortal() {
  useStyle(css)
  const navigate = useNavigate()
  const { showToast, toastContainer } = useToast()

  const [tab, setTab] = useState('classes')
  const [joinOpen, setJoinOpen] = useState(false)
  const [classCode, setClassCode] = useState('')
  const [manualCode, setManualCode] = useState('')

  const scannerRef = useRef(null)

  const stopScanner = async () => {
    const s = scannerRef.current
    if (s && s.isScanning) {
      try {
        await s.stop()
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
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="avatar">SP</div>
          <div>
            <h1 className="user-name">Student Name</h1>
            <p className="user-id">Student ID: --------</p>
          </div>
        </div>

        <div className="navbar-actions">
          <button className="btn btn-primary" onClick={openJoin}>
            <i className="fa-solid fa-plus"></i> Join Class
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/')}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </nav>

      <div className="layout">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            {navItems.map((item) => (
              <li
                key={item.key}
                className={`sidebar-item${tab === item.key ? ' active' : ''}`}
                onClick={() => setTab(item.key)}
              >
                <i className={`fa-solid ${item.icon}`}></i>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>

          <div className="sidebar-status">
            <p className="sidebar-status-title">Attendance Ready</p>
            <p className="sidebar-status-text">No active attendance tokens detected.</p>
          </div>
        </aside>

        <main className="main-content">
          <section className="view" style={show('classes')}>
            <div className="view-header">
              <div>
                <h2>Classes</h2>
                <p className="view-subtitle">Enrolled courses and attendance logs.</p>
              </div>
            </div>

            <div className="class-grid">
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="fa-solid fa-book-open"></i>
                </div>
                <div>
                  <h3>No classes enrolled yet</h3>
                  <p>
                    You are not currently enrolled in any classes. Use "Join Class" above to get
                    started.
                  </p>
                </div>
                <button className="btn btn-primary" onClick={openJoin}>
                  Join a Class Now
                </button>
              </div>
            </div>
          </section>

          <section className="view" style={show('archived')}>
            <div className="view-header">
              <div>
                <h2>Archived Class</h2>
                <p className="view-subtitle">Previous semester or completed courses.</p>
              </div>
            </div>

            <div className="class-grid">
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="fa-solid fa-box-archive"></i>
                </div>
                <div>
                  <h3>No archived classes</h3>
                  <p>Archived courses from past terms will appear here.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="view view-narrow" style={show('scan')}>
            <div className="view-header">
              <div>
                <h2>QR Scanner</h2>
                <p className="view-subtitle">Scan event or class check-in codes.</p>
              </div>
            </div>

            <div className="scan-card">
              <div className="camera-box">
                <div id="reader"></div>
              </div>
              <button className="btn btn-primary" onClick={startScanner}>
                <i className="fa-solid fa-camera"></i> Start Scanning
              </button>

              <div className="manual-checkin">
                <label htmlFor="scan-code-input">Manual Code Check-in</label>
                <div className="manual-row">
                  <input
                    type="text"
                    id="scan-code-input"
                    className="input input-mono"
                    placeholder="Enter session or check-in code..."
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={submitManual}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <div className={`modal-overlay${joinOpen ? ' active' : ''}`}>
        <div className="modal-card">
          <div className="modal-head">
            <div className="modal-title-wrap">
              <div className="avatar avatar-sm">JC</div>
              <div>
                <h3>Join a Class</h3>
                <p>Enter class code provided by instructor</p>
              </div>
            </div>
            <button className="icon-btn" aria-label="Close" onClick={() => setJoinOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form id="join-form" onSubmit={submitJoin}>
            <label htmlFor="class-code-input">Class Code</label>
            <input
              type="text"
              id="class-code-input"
              className="input input-mono input-upper"
              placeholder="e.g. CS-301-2026"
              required
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-block">
              Join Class
            </button>
          </form>
        </div>
      </div>

      {toastContainer}
    </>
  )
}