import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import s from '../TeacherPortal/ClassDetail/ClassDetail.module.css'
import EmptyState from '../../components/EmptyState/EmptyState'
import { getJson } from '../../api/client'
import { CLASS_COLORS } from '../TeacherPortal/classColors'
import { fmtDate, fmtTime } from '../TeacherPortal/ClassDetail/format'

const STATUS_STYLE = {
  Present: { background: '#ecfdf5', color: '#059669' },
  Late: { background: '#fff7ed', color: '#ea580c' },
  Absent: { background: '#fef2f2', color: '#dc2626' },
  'Not checked in': { background: '#fefce8', color: '#ca8a04' },
  Upcoming: { background: '#eff6ff', color: '#2563eb' },
}

export default function StudentClassDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getJson(`/api/student/classes/${id}/sessions`)
      .then((d) => (d.success ? setData(d) : setError(d.msg || 'Class not found')))
      .catch(() => setError('Failed to load class.'))
  }, [id])

  const goBack = () => navigate('/student/dashboard')

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
  if (!data) return null

  const { class: cls, sessions } = data
  const color = CLASS_COLORS[cls.color] || CLASS_COLORS.blue
  const count = (st) => sessions.filter((x) => x.status === st).length

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
              <h1 className={s.subject}>{cls.subjectName}</h1>
              <p className={s.section}>
                {cls.section || 'No section'} · {(cls.teacherName || '').trim()}
              </p>
            </div>
            <div className={s.headerRight}>
              {cls.archived ? <span className={s.archivedTag}>Archived</span> : null}
              <span className={s.codePill}>{cls.classCode}</span>
            </div>
          </div>
        </header>

        <div className={s.headerRight} style={{ gap: 8, flexWrap: 'wrap' }}>
          {['Present', 'Late', 'Absent'].map((st) => (
            <span key={st} className={s.badge} style={STATUS_STYLE[st]}>
              {st}: {count(st)}
            </span>
          ))}
        </div>

        <section className={s.sessionList}>
          <div className={s.sectionHead}>
            <div>
              <h3>My Attendance</h3>
              <p>Your status for each session. Use the Scan tab to check in.</p>
            </div>
          </div>

          {sessions.length === 0 && (
            <EmptyState
              icon="fa-calendar"
              title="No sessions yet"
              text="Your teacher hasn't created a session since you joined."
            />
          )}

          {sessions.map((x) => (
            <div className={s.session} key={x.id}>
              <div>
                <div className={s.sessionDate}>{fmtDate(x.sessionDate)}</div>
                <div className={s.sessionMeta}>
                  {fmtTime(x.classStart)} – {fmtTime(x.classEnd)} · Late after {fmtTime(x.lateAfter)}
                  {x.timeIn ? ` · Checked in ${fmtTime(x.timeIn)}` : ''}
                </div>
              </div>
              <span className={s.badge} style={STATUS_STYLE[x.status]}>
                {x.status}
              </span>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}