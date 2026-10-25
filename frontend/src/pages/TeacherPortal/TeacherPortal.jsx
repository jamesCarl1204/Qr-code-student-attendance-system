import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './TeacherPortal.module.css'
import useToast from '../../hooks/useToast'
import ToastContainer from '../../components/Toast/Toast'
import Topbar from '../../components/Topbar/Topbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import ClassesView from './views/ClassesView'
import ArchivedView from './views/ArchivedView'
import AiChatView from './views/AiChatView'
import CreateClassModal from './components/CreateClassModal'
import { logout } from '../../api/client'

const navItems = [
  { key: 'classes', icon: 'fa-book-open', label: 'Classes' },
  { key: 'archived', icon: 'fa-box-archive', label: 'Archived Class' },
  { key: 'ai-chat', icon: 'fa-robot', label: 'AI Assistant Chatbot' },
]


export default function TeacherPortal() {
  const navigate = useNavigate()
  const { toasts, showToast, removeToast } = useToast()

  const [tab, setTab] = useState('classes')
  const [modalOpen, setModalOpen] = useState(false)
  const [me, setMe] = useState(null)

  useEffect(() => {
    fetch('/api/me').then((r) => r.json()).then((d) => d.success && setMe(d))
  }, [])

  const handleLogout = async () => {
  await logout()
  navigate('/', { replace: true})
}

  return (
    <div className={s.app}>
      <Topbar mark="TP" title="Teacher Portal" subtitle="QR Attendance & AI Assistant">
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <i className="fa-solid fa-plus"></i> Create Class
        </button>
        <button className="btn btn-ghost" onClick={() => handleLogout()}>
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      </Topbar>

      <div className={s.layout}>
        <Sidebar
          navItems={navItems}
          tab={tab}
          onChange={setTab}
          statusTitle="Assistant Active"
          statusText="Ready to help with attendance questions."
        />

        <main className={s.content}>
          {tab === 'classes' && <ClassesView onCreate={() => setModalOpen(true)} />}
          {tab === 'archived' && <ArchivedView />}
          {tab === 'ai-chat' && <AiChatView showToast={showToast} />}
        </main>
      </div>

      <CreateClassModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        showToast={showToast}
      />
      <ToastContainer toasts={toasts} onDone={removeToast} />
    </div>
  )
}
