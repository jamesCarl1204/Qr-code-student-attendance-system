import { useState } from 'react'
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

const navItems = [
  { key: 'classes', icon: 'fa-book-open', label: 'Classes' },
  { key: 'archived', icon: 'fa-box-archive', label: 'Archived Class' },
  { key: 'scan', icon: 'fa-qrcode', label: 'Scan' },
]

export default function StudentPortal() {
  const navigate = useNavigate()
  const { toasts, showToast, removeToast } = useToast()

  const [tab, setTab] = useState('classes')
  const [joinOpen, setJoinOpen] = useState(false)

  return (
    <div className={s.app}>
      <Topbar mark="SP" title="Student Name" subtitle="Student ID: --------">
        <button className="btn btn-primary" onClick={() => setJoinOpen(true)}>
          <i className="fa-solid fa-plus"></i> Join Class
        </button>
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
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
          {tab === 'classes' && <ClassesView onJoin={() => setJoinOpen(true)} />}
          {tab === 'archived' && <ArchivedView />}
          {tab === 'scan' && <ScanView showToast={showToast} />}
        </main>
      </div>

      <JoinClassModal open={joinOpen} onClose={() => setJoinOpen(false)} showToast={showToast} />
      <ToastContainer toasts={toasts} onDone={removeToast} />
    </div>
  )
}
