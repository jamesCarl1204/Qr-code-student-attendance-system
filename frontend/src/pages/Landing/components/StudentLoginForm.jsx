import { useState } from 'react'
import s from '../Landing.module.css'
import { postJson, firstError } from '../../../api/client'

export default function StudentLoginForm({ onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [err, setErr] = useState({})

  const onChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setErr({})
    try {
      const data = await postJson('/api/student/login', form)
      if (!data.success) {
        setErr(data.errors ? firstError(data.errors) : { password: data.msg })
        return
      }
      onSuccess()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form className={s['modal-form']} onSubmit={submit}>
      <label>Email</label>
      <input
        type="email"
        placeholder="Enter email..."
        required
        value={form.email}
        onChange={onChange('email')}
      />
      <div className={s.err}>{err.email}</div>

      <label>Password</label>
      <input
        type="password"
        placeholder="Enter password..."
        required
        value={form.password}
        onChange={onChange('password')}
      />
      <div className={s.err}>{err.password}</div>

      <button type="submit">Sign In</button>
    </form>
  )
}
