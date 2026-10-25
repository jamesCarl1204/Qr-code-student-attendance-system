import { useState } from 'react'
import Modal from '../../../components/Modal/Modal'
import { postJson, firstError } from '../../../api/client'
import { addMinutes, todayLocal } from './format'

export default function CreateSessionModal({ open, classId, onClose, onCreated, showToast }) {
  const [sessionDate, setSessionDate] = useState(todayLocal())
  const [classStart, setClassStart] = useState('')
  const [classEnd, setClassEnd] = useState('')
  const [lateAfter, setLateAfter] = useState('')
  const [lateTouched, setLateTouched] = useState(false)
  const [err, setErr] = useState({})
  const [saving, setSaving] = useState(false)

  // Default late_after = class_start + 10 minutes, hangga't hindi pa ine-edit ng teacher
  const handleStart = (value) => {
    setClassStart(value)
    if (value && !lateTouched) setLateAfter(addMinutes(value, 10))
  }

  const reset = () => {
    setSessionDate(todayLocal())
    setClassStart('')
    setClassEnd('')
    setLateAfter('')
    setLateTouched(false)
    setErr({})
  }

  const submit = async (e) => {
    e.preventDefault()
    setErr({})
    setSaving(true)
    try {
      const data = await postJson(`/api/teacher/classes/${classId}/sessions`, {
        sessionDate,
        classStart,
        classEnd,
        lateAfter,
      })
      if (!data.success) {
        if (data.errors) setErr(firstError(data.errors))
        else showToast(data.msg || 'Failed to create session.', 'error')
        return
      }
      showToast('Session created.', 'success')
      reset()
      onClose()
      onCreated(data.session)
    } catch {
      showToast('Failed to create session.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      mark="NS"
      title="New Attendance Session"
      subtitle="A QR code is generated once created"
    >
      <form className="form" onSubmit={submit}>
        <label>Date</label>
        <input
          type="date"
          className="input"
          required
          value={sessionDate}
          onChange={(e) => setSessionDate(e.target.value)}
        />
        <div className="form-err">{err.sessionDate}</div>

        <div className="form-grid">
          <div>
            <label>Class start</label>
            <input
              type="time"
              className="input"
              required
              value={classStart}
              onChange={(e) => handleStart(e.target.value)}
            />
            <div className="form-err">{err.classStart}</div>
          </div>
          <div>
            <label>Class end</label>
            <input
              type="time"
              className="input"
              required
              value={classEnd}
              onChange={(e) => setClassEnd(e.target.value)}
            />
            <div className="form-err">{err.classEnd}</div>
          </div>
        </div>

        <label>Late after</label>
        <input
          type="time"
          className="input"
          required
          value={lateAfter}
          onChange={(e) => {
            setLateTouched(true)
            setLateAfter(e.target.value)
          }}
        />
        <div className="form-err">{err.lateAfter}</div>

        <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
          {saving ? 'Creating...' : 'Create Session'}
        </button>
      </form>
    </Modal>
  )
}