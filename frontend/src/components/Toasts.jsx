import { useCallback, useEffect, useState } from 'react'

const icons = {
  success: 'fa-circle-check',
  error: 'fa-circle-exclamation',
  info: 'fa-circle-info',
}

function ToastItem({ toast, onDone }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 10)
    const t2 = setTimeout(() => setShow(false), 3000)
    const t3 = setTimeout(() => onDone(toast.id), 3300)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [toast.id, onDone])

  return (
    <div className={`toast toast-${toast.type}${show ? ' show' : ''}`}>
      <i className={`fa-solid ${icons[toast.type]}`}></i>
      <span>{toast.message}</span>
    </div>
  )
}

export default function useToast() {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'success') => {
    setToasts((prev) => [...prev, { id: crypto.randomUUID(), message, type }])
  }, [])

  const toastContainer = (
    <div id="toast-container">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDone={remove} />
      ))}
    </div>
  )

  return { showToast, toastContainer }
}