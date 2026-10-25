import { useState } from 'react'
import Modal from '../../../components/Modal/Modal'
import { postJson, firstError } from '../../../api/client'
import { CLASS_COLORS } from '../classColors'

export default function CreateClassModal({ open, onClose, onCreated, showToast }) {
  const [subjectName, setSubjectName] = useState('')
  const [section, setSection] = useState('')
  const [color, setColor] = useState('blue')
  const [err, setErr] = useState({})
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr({})
    setSaving(true)
    try {
      const data = await postJson('/api/teacher/classes', { subjectName, section, color })
      if (!data.success) {
        if (data.errors) setErr(firstError(data.errors))
        else showToast(data.msg || 'Failed to create class.', 'error')
        return
      }
      showToast(`Class created. Code: ${data.class.classCode}`, 'success')
      setSubjectName('')
      setSection('')
      setColor('blue')
      onCreated()
      onClose()
    } catch {
      showToast('Failed to create class.', 'error')
    } finally {
      setSaving(false)
    }
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
        <label>Subject Name</label>
        <input
          type="text"
          className="input"
          placeholder="e.g. Advanced Data Structures"
          required
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
        />
        <div className="form-err">{err.subjectName}</div>

        <label>Section / Room</label>
        <input
          type="text"
          className="input"
          placeholder="e.g. BSCS 3-A"
          value={section}
          onChange={(e) => setSection(e.target.value)}
        />
        <div className="form-err">{err.section}</div>

        <label>Color</label>
        <div className="swatches">
          {Object.entries(CLASS_COLORS).map(([name, hex]) => (
            <button
              key={name}
              type="button"
              aria-label={name}
              className={`swatch ${color === name ? 'active' : ''}`}
              style={{ background: hex }}
              onClick={() => setColor(name)}
            />
          ))}
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={saving}>
          {saving ? 'Creating...' : 'Create Class'}
        </button>
      </form>
    </Modal>
  )
}