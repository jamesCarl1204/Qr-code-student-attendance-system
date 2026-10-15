import { useState } from 'react'
import s from '../Landing.module.css'
import { postJson, firstError } from '../../../api/client'

const emptyReg = {
  name: '',
  middleName: '',
  lastName: '',
  studentId: '',
  email: '',
  password: '',
  confirmPassword: '',
  parentEmail: '',
}

export default function RegisterForm({ onRegistered }) {
  const [reg, setReg] = useState(emptyReg)
  const [err, setErr] = useState({})

  const onChange = (field) => (e) => setReg((p) => ({ ...p, [field]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setErr({})
    try {
      const data = await postJson('/api/student/register', reg)
      if (data.errors) {
        setErr(firstError(data.errors))
        return
      }
      if (data.success) {
        alert('Registration successful! You can now log in.')
        setReg(emptyReg)
        onRegistered()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form className={s['modal-form']} onSubmit={submit}>
      <div className={s['grid-2']}>
        <div>
          <label>Student ID</label>
          <input
            placeholder="Enter student ID..."
            required
            value={reg.studentId}
            onChange={onChange('studentId')}
          />
          <div className={s.err}>{err.studentId}</div>
        </div>
        <div>
          <label>First Name</label>
          <input placeholder="Enter name..." required value={reg.name} onChange={onChange('name')} />
          <div className={s.err}>{err.name}</div>
        </div>
      </div>

      <div className={s['grid-2']}>
        <div>
          <label>Middle Name</label>
          <input
            placeholder="Optional"
            value={reg.middleName}
            onChange={onChange('middleName')}
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            placeholder="Enter lastname..."
            required
            value={reg.lastName}
            onChange={onChange('lastName')}
          />
          <div className={s.err}>{err.lastName}</div>
        </div>
      </div>

      <label>Student Email</label>
      <input
        type="email"
        placeholder="Enter email..."
        required
        value={reg.email}
        onChange={onChange('email')}
      />
      <div className={s.err}>{err.email}</div>

      <label>Password</label>
      <input
        type="password"
        placeholder="Enter password..."
        required
        value={reg.password}
        onChange={onChange('password')}
      />
      <div className={s.err}>{err.password}</div>

      <label>Confirm Password</label>
      <input
        type="password"
        placeholder="Confirm password..."
        required
        value={reg.confirmPassword}
        onChange={onChange('confirmPassword')}
      />
      <div className={s.err}>{err.confirmPassword}</div>

      <label>Parent's Email</label>
      <input
        type="email"
        placeholder="Parent/guardian email..."
        required
        value={reg.parentEmail}
        onChange={onChange('parentEmail')}
      />
      <div className={s.err}>{err.parentEmail}</div>

      <button type="submit">Create Student Account</button>
    </form>
  )
}
