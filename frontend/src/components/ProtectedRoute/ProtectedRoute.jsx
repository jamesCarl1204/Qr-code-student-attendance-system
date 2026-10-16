import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ role, children }) {
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    fetch('/api/check')
      .then((res) => res.json())
      .then((data) => setStatus(data.success && data.role === role ? 'ok' : 'denied'))
      .catch(() => setStatus('denied'))
  }, [role])

  if (status === 'loading') return null
  if (status === 'denied') return <Navigate to="/" replace />
  return children
}