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
import useClasses from './hooks/useClasses'
import { logout } from '../../api/client'

const navItems = [
  { key: 'classes', icon: 'fa-book-open', label: 'Classes' },
  { key: 'archived', icon: 'fa-box-archive', label: 'Archived Class' },
  { key: 'ai-chat', icon: 'fa-robot', label: 'AI Assistant Chatbot' },
]

export default function TeacherPortal() {
  const navigate = useNavigate()
  const { toasts, showToast, removeToast } = useToast()
  const { classes, loading, reload, archive, remove } = useClasses()

  const [tab, setTab] = useState('classes')
  const [modalOpen, setModalOpen] = useState(false)
  const [me, setMe] = useState(null)

  useEffect(() => {
    fetch('/api/me').then((r) => r.json()).then((d) => d.success && setMe(d))
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  //const handleOpen = () => showToast('Class detail page is the next step.', 'info')
       const handleOpen = (c) => navigate(`/teacher/classes/${c.id}`)
  const handleArchive = async (c) => {
    const data = await archive(c.id, !c.archived)
    if (data.success) showToast(c.archived ? 'Class restored.' : 'Class archived.', 'success')
    else showToast(data.msg || 'Failed.', 'error')
  }

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete "${c.subjectName}"? This cannot be undone.`)) return
    const data = await remove(c.id)
    if (data.success) showToast('Class deleted.', 'success')
    else showToast(data.msg || 'Failed.', 'error')
  }

  return (
    <div className={s.app}>
      <Topbar
        mark="TP"
        title={me?.name || 'Teacher Portal'}
        subtitle="QR Attendance & AI Assistant"
      >
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <i className="fa-solid fa-plus"></i> Create Class
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
          statusTitle="Assistant Active"
          statusText="Ready to help with attendance questions."
        />

        <main className={s.content}>
          {tab === 'classes' && (
            <ClassesView
              classes={classes}
              loading={loading}
              onCreate={() => setModalOpen(true)}
              onOpen={handleOpen}
              onArchive={handleArchive}
              onDelete={handleDelete}
            />
          )}
          {tab === 'archived' && (
            <ArchivedView
              classes={classes}
              loading={loading}
              onOpen={handleOpen}
              onArchive={handleArchive}
              onDelete={handleDelete}
            />
          )}
          {tab === 'ai-chat' && <AiChatView showToast={showToast} />}
        </main>
      </div>

      <CreateClassModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={reload}
        showToast={showToast}
      />
      <ToastContainer toasts={toasts} onDone={removeToast} />
    </div>
  )
}