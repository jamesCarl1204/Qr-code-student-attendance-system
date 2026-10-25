import { useEffect, useState } from 'react'
import Modal from '../../../components/Modal/Modal'
import s from './ClassDetail.module.css'
import { getJson } from '../../../api/client'
import { fmtDate, fmtTime } from './format'

// Ima-mount lang ito kapag may napiling session (may key=session.id sa parent)
export default function QrModal({ session, onClose }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getJson(`/api/teacher/sessions/${session.id}/qr`)
      .then((d) => {
        if (cancelled) return
        if (d.success) setData(d)
        else setError(d.msg || 'Failed to load QR code.')
      })
      .catch(() => !cancelled && setError('Failed to load QR code.'))
    return () => {
      cancelled = true
    }
  }, [session.id])

  return (
    <Modal
      open
      onClose={onClose}
      mark="QR"
      title="Attendance QR"
      subtitle={`${fmtDate(session.session_date)} · ${fmtTime(session.class_start)} – ${fmtTime(session.class_end)}`}
    >
      {error && <p className={s.qrHint}>{error}</p>}
      {!error && !data && <p className={`${s.qrHint} ${s.qrLoading}`}>Generating QR code...</p>}
      {data && (
        <div className={s.qrBox}>
          <img className={s.qrImg} src={data.qr} alt="Attendance QR code" />
          <div className={s.qrCode}>{data.code}</div>
          <p className={s.qrHint}>Students scan this QR, or type the code manually.</p>
        </div>
      )}
    </Modal>
  )
}