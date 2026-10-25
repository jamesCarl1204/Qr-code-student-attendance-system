import { useCallback, useEffect, useState } from 'react'
import s from './ClassDetail.module.css'
import EmptyState from '../../../components/EmptyState/EmptyState'
import CreateSessionModal from './CreateSessionModal'
import QrModal from './QrModal'
import { getJson } from '../../../api/client'
import { fmtDate, fmtTime } from './format'

const BADGE = { Upcoming: s.badgeUpcoming, Ongoing: s.badgeOngoing, Ended: s.badgeEnded }

export default function AttendanceTab({ cls, showToast }) {
  const [sessions, setSessions] = useState(null) // null = loading pa
  const [createOpen, setCreateOpen] = useState(false)
  const [qrSession, setQrSession] = useState(null)

  const load = useCallback(async () => {
    try {
      const data = await getJson(`/api/teacher/classes/${cls.id}/sessions`)
      if (data.success) setSessions(data.sessions)
    } catch {
      showToast('Failed to load sessions.', 'error')
    }
  }, [cls.id, showToast])

  useEffect(() => {
    load()
  }, [load])

  const handleCreated = (session) => {
    load()
    setQrSession(session)
  }

  const newBtn = (
    <button className="btn btn-primary" disabled={!!cls.archived} onClick={() => setCreateOpen(true)}>
      <i className="fa-solid fa-plus"></i> New Session
    </button>
  )

  return (
    <section className={s.sessionList}>
      <div className={s.sectionHead}>
        <div>
          <h3>Attendance Sessions</h3>
          <p>Create a session to generate its QR code.</p>
        </div>
        {newBtn}
      </div>

      {sessions && sessions.length === 0 && (
        <EmptyState
          icon="fa-calendar-plus"
          title="No sessions yet"
          text='Click "New Session" to set the date and time, then show the QR code to your students.'
        />
      )}

      {sessions &&
        sessions.map((x) => (
          <div className={s.session} key={x.id}>
            <div>
              <div className={s.sessionDate}>{fmtDate(x.session_date)}</div>
              <div className={s.sessionMeta}>
                {fmtTime(x.class_start)} – {fmtTime(x.class_end)} · Late after {fmtTime(x.late_after)}
              </div>
            </div>
            <div className={s.sessionRight}>
              <span className={`${s.badge} ${BADGE[x.status]}`}>{x.status}</span>
              <button className="btn btn-outline" onClick={() => setQrSession(x)}>
                <i className="fa-solid fa-qrcode"></i> Show QR
              </button>
            </div>
          </div>
        ))}

      <CreateSessionModal
        open={createOpen}
        classId={cls.id}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
        showToast={showToast}
      />

      {qrSession && <QrModal key={qrSession.id} session={qrSession} onClose={() => setQrSession(null)} />}
    </section>
  )
}