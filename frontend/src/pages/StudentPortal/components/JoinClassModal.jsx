import { useState } from 'react'
import Modal from '../../../components/Modal/Modal'

export default function JoinClassModal({ open, onClose, showToast }) {
  const [classCode, setClassCode] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const code = classCode.trim()
    if (!code) return
    onClose()
    setClassCode('')
    showToast(`Join request for ${code.toUpperCase()}`, 'info')
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
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
          placeholder="e.g. CS-301-2026"
          required
          value={classCode}
          onChange={(e) => setClassCode(e.target.value)}
        />
        <button type="submit" className="btn btn-primary btn-block">
          Join Class
        </button>
      </form>
    </Modal>
  )
}
