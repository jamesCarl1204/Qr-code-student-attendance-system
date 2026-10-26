import { useState } from 'react'
import Modal from '../../../components/Modal/Modal'
import { postJson } from '../../../api/client'

export default function JoinClassModal({ open, onClose, showToast, onJoined }) {
  const [classCode, setClassCode] = useState('')
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)

  const close = () => {
    setErr('')
    onClose()
  }

  const submit = async (e) => {
    e.preventDefault()
    const code = classCode.trim()
    if (!code) return
    setErr('')
    setSaving(true)
    try {
      const data = await postJson('/api/student/classes/join', { classCode: code })
      if (!data.success) {
        setErr(data.msg || 'Failed to join class.')
        return
      }
      showToast(`Joined ${data.class.subjectName}.`, 'success')
      setClassCode('')
      onClose()
      onJoined()
    } catch {
      setErr('Failed to join class.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={close}
      mark="JC"
      title="Join a Class"
      subtitle="Enter class code provided by instructor"
    >
      <form className="form" onSubmit={submit}>
        <label htmlFor="class-code-input">Class Code</label>
        <input
          type="text"
          id="class-code-input"
          className="input input-mono input-upper"
          placeholder="e.g. SOF-LATYC"
          required
          value={classCode}
          onChange={(e) => {
            setClassCode(e.target.value)
            setErr('')
          }}
        />
        <div className="form-err">{err}</div>
        <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
          {saving ? 'Joining...' : 'Join Class'}
        </button>
      </form>
    </Modal>
  )
}