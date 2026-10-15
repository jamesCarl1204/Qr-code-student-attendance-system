import { useCallback, useState } from 'react'

export default function useToast() {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'success') => {
    setToasts((prev) => [...prev, { id: crypto.randomUUID(), message, type }])
  }, [])

  return { toasts, showToast, removeToast }
}
