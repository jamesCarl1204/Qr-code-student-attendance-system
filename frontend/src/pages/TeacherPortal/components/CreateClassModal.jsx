import { useState } from 'react'
import Modal from '../../../components/Modal/Modal'

export default function CreateClassModal({ open, onClose, showToast }) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [section, setSection] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const n = name.trim()
    const c = code.trim()
    if (!n || !c) return

    onClose()
    showToast(`Class "${n}" (${c}) created successfully!`, 'success')
    setName('')
    setCode('')
    setSection('')
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      mark="CC"
      title="Create New Class"
      subtitle="Set up course details for QR attendance"
    >
      <form className="form" onSubmit={submit}>
        <label>Class Name</label>
        <input
          type="text"
          className="input"
          placeholder="e.g. Advanced Data Structures"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="form-grid">
          <div>
            <label>Subject Code</label>
            <input
              type="text"
              className="input input-mono input-upper"
              placeholder="e.g. CS-302"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div>
            <label>Section / Room</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Room 402"
              required
              value={section}
              onChange={(e) => setSection(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Create Class Session
        </button>
      </form>
    </Modal>
  )
}
