import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import s from './ClassDetail.module.css'
import useToast from '../../../hooks/useToast'
import ToastContainer from '../../../components/Toast/Toast'
import AttendanceTab from './AttendanceTab'
import { getJson } from '../../../api/client'
import { CLASS_COLORS } from '../classColors'

export default function ClassDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toasts, showToast, removeToast } = useToast()

  const [cls, setCls] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getJson(`/api/teacher/classes/${id}`)
      .then((d) => (d.success ? setCls(d.class) : setError(d.msg || 'Class not found')))
      .catch(() => setError('Failed to load class.'))
  }, [id])

  const goBack = () => navigate('/teacher/dashboard')

  if (error) {
    return (
      <div className={s.page}>
        <div className={s.wrap}>
          <button className="btn btn-outline" onClick={goBack}>
            <i className="fa-solid fa-arrow-left"></i> Back to classes
          </button>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!cls) return null

  const color = CLASS_COLORS[cls.color] || CLASS_COLORS.blue

  return (
    <div className={s.page}>
      <div className={s.wrap}>
        <button className={`btn btn-outline ${s.back}`} onClick={goBack}>
          <i className="fa-solid fa-arrow-left"></i> Back to classes
        </button>

        <header className={s.header}>
          <div className={s.headerBar} style={{ background: color }} />
          <div className={s.headerBody}>
            <div>
              <h1 className={s.subject}>{cls.subject_name}</h1>
              <p className={s.section}>{cls.section || 'No section'}</p>
            </div>
            <div className={s.headerRight}>
              {cls.archived ? <span className={s.archivedTag}>Archived</span> : null}
              <span className={s.codePill}>{cls.class_code}</span>
            </div>
          </div>
        </header>

        <nav className={s.tabs}>
          <button className={`${s.tab} ${s.tabActive}`}>Attendance</button>
          <button className={s.tab} disabled title="Coming soon">Summary</button>
          <button className={s.tab} disabled title="Coming soon">Members</button>
        </nav>

        <AttendanceTab cls={cls} showToast={showToast} />
      </div>
      <ToastContainer toasts={toasts} onDone={removeToast} />
    </div>
  )
}