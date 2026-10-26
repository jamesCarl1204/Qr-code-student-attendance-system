import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './StudentPortal.module.css'
import useToast from '../../hooks/useToast'
import ToastContainer from '../../components/Toast/Toast'
import Topbar from '../../components/Topbar/Topbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import ClassesView from './views/ClassesView'
import ArchivedView from './views/ArchivedView'
import ScanView from './views/ScanView'
import JoinClassModal from './components/JoinClassModal'
import useStudentClasses from './hooks/useStudentClasses'
import { logout } from '../../api/client'

const navItems = [
  { key: 'classes', icon: 'fa-book-open', label: 'Classes' },
  { key: 'archived', icon: 'fa-box-archive', label: 'Archived Class' },
  { key: 'scan', icon: 'fa-qrcode', label: 'Scan' },
]

export default function StudentPortal() {
  const navigate = useNavigate()
  const { toasts, showToast, removeToast } = useToast()
  const { classes, loading, reload, leave } = useStudentClasses()

  const [tab, setTab] = useState('classes')
  const [joinOpen, setJoinOpen] = useState(false)
  const [me, setMe] = useState(null)

  useEffect(() => {
    fetch('/api/me').then((r) => r.json()).then((d) => d.success && setMe(d))
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  const handleOpen = (c) => navigate(`/student/classes/${c.id}`)

  const handleLeave = async (c) => {
    if (!window.confirm(`Leave "${c.subjectName}"?`)) return
    const data = await leave(c.id)
    if (data.success) showToast('You left the class.', 'success')
    else showToast(data.msg || 'Failed.', 'error')
  }

  return (
    <div className={s.app}>
      <Topbar
        mark="SP"
        title={me?.name || 'Student'}
        subtitle={`Student ID: ${me?.idNumber || '--------'}`}
      >
        <button className="btn btn-primary" onClick={() => setJoinOpen(true)}>
          <i className="fa-solid fa-plus"></i> Join Class
        </button>
        <button className="btn btn-ghost" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      </Topbar>

      <div className={s.layout}>
        <Sidebar
          navItems={navItems}
          tab={tab}
          onChange={setTab}
          statusTitle="Attendance Ready"
          statusText="No active attendance tokens detected."
        />

        <main className={s.content}>
          {tab === 'classes' && (
            <ClassesView
              classes={classes}
              loading={loading}
              onJoin={() => setJoinOpen(true)}
              onLeave={handleLeave}
              onOpen={handleOpen}
            />
          )}
          {tab === 'archived' && (
            <ArchivedView
              classes={classes}
              loading={loading}
              onLeave={handleLeave}
              onOpen={handleOpen}
            />
          )}
          {tab === 'scan' && <ScanView showToast={showToast} />}
        </main>
      </div>

      <JoinClassModal
        open={joinOpen}
        onClose={() => setJoinOpen(false)}
        showToast={showToast}
        onJoined={reload}
      />
      <ToastContainer toasts={toasts} onDone={removeToast} />
    </div>
  )
}