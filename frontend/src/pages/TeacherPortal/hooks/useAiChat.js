import { useState } from 'react'
import { postJson } from '../../../api/client'

const WELCOME =
  "Hello Teacher! I'm your attendance assistant. Ask me about a student's check-in history, today's class attendance, or who's marked late or absent."
const CLEARED = 'Chat history cleared. How else can I assist your teaching workflow today?'
const FALLBACK = "I'm sorry, I couldn't generate a response right now. Please try again."

export default function useAiChat({ showToast }) {
  const [messages, setMessages] = useState([{ role: 'ai', text: WELCOME }])
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    const text = prompt.trim()
    if (!text) return

    setMessages((m) => [...m, { role: 'user', text }])
    setPrompt('')
    setLoading(true)

    try {
      const data = await postJson('/api/teacher/ai-chat', { prompt: text })
      setMessages((m) => [...m, { role: 'ai', text: data.reply || FALLBACK }])
    } catch {
      showToast('Failed to reach the AI assistant.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const clear = () => setMessages([{ role: 'ai', text: CLEARED }])

  return { messages, prompt, setPrompt, loading, submit, clear }
}
