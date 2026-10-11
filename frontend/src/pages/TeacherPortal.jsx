import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStyle from '../hooks/useStyle'
import useToast from '../components/Toasts'
import css from '../styles/teacher.css?inline'

const WELCOME =
  "Hello Teacher! I'm your attendance assistant. Ask me about a student's check-in history, today's class attendance, or who's marked late or absent."
const CLEARED = 'Chat history cleared. How else can I assist your teaching workflow today?'

export default function TeacherPortal() {
  useStyle(css)
  const navigate = useNavigate()
  const { showToast, toastContainer } = useToast()

  const [tab, setTab] = useState('classes')

  const [modalOpen, setModalOpen] = useState(false)
  const [className, setClassName] = useState('')
  const [classCode, setClassCode] = useState('')
  const [classSection, setClassSection] = useState('')

  const [messages, setMessages] = useState([{ role: 'ai', text: WELCOME }])
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const chatRef = useRef(null)

  useEffect(() => {
    const el = chatRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  const submitClass = (e) => {
    e.preventDefault()
    const name = className.trim()
    const code = classCode.trim()
    if (!name || !code) return

    setModalOpen(false)
    showToast(`Class "${name}" (${code}) created successfully!`, 'success')
    setClassName('')
    setClassCode('')
    setClassSection('')
  }

  const submitChat = async (e) => {
    e.preventDefault()
    const text = prompt.trim()
    if (!text) return

    setMessages((m) => [...m, { role: 'user', text }])
    setPrompt('')
    setLoading(true)

    try {
      const response = await fetch('/api/teacher/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      })
      const data = await response.json()
      const reply =
        data.reply || "I'm sorry, I couldn't generate a response right now. Please try again."
      setMessages((m) => [...m, { role: 'ai', text: reply }])
    } catch {
      showToast('Failed to reach the AI assistant.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => setMessages([{ role: 'ai', text: CLEARED }])

  const navItems = [
    { key: 'classes', icon: 'fa-book-open', label: 'Classes' },
    { key: 'archived', icon: 'fa-box-archive', label: 'Archived Class' },
    { key: 'ai-chat', icon: 'fa-robot', label: 'AI Assistant Chatbot' },
  ]

  const hide = (name) => (tab === name ? '' : ' hidden')

  return (
    <>
      <div className="app">
        <header className="topbar">
          <div className="brand">
            <div className="logo-box">TP</div>
            <div className="brand-text">
              <h1>Teacher Portal</h1>
              <p>QR Attendance &amp; AI Assistant</p>
            </div>
          </div>

          <div className="topbar-actions">
            <button className="btn btn-dark" onClick={() => setModalOpen(true)}>
              <i className="fa-solid fa-plus"></i> Create Class
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/')}>
              <i className="fa-solid fa-right-from-bracket"></i> Logout
            </button>
          </div>
        </header>

        <div className="layout">
          <aside className="sidebar">
            <nav className="sidebar-nav">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  className={`sidebar-btn${tab === item.key ? ' active' : ''}`}
                  onClick={() => setTab(item.key)}
                >
                  <i className={`fa-solid ${item.icon}`}></i> {item.label}
                </button>
              ))}
            </nav>

            <div className="sidebar-status">
              <div className="sidebar-status-title">Assistant Active</div>
              <p>Ready to help with attendance questions.</p>
            </div>
          </aside>

          <main className="content">
            <section className={`view${hide('classes')}`}>
              <div className="view-header">
                <div>
                  <h2>Classes</h2>
                  <p>Active courses and attendance monitoring sessions.</p>
                </div>
              </div>

              <div className="empty-state">
                <div className="empty-icon">
                  <i className="fa-solid fa-book-open"></i>
                </div>
                <div className="empty-copy">
                  <h3>No classes created yet</h3>
                  <p>
                    You haven't set up any active classes. Use "Create Class" above to start
                    generating QR attendance sessions.
                  </p>
                </div>
                <button className="btn btn-dark" onClick={() => setModalOpen(true)}>
                  Create a Class Now
                </button>
              </div>
            </section>

            <section className={`view${hide('archived')}`}>
              <div className="view-header">
                <div>
                  <h2>Archived Class</h2>
                  <p>Previous semester or completed courses.</p>
                </div>
              </div>

              <div className="empty-state">
                <div className="empty-icon">
                  <i className="fa-solid fa-box-archive"></i>
                </div>
                <div className="empty-copy">
                  <h3>No archived classes</h3>
                  <p>Archived courses from previous terms will appear here.</p>
                </div>
              </div>
            </section>

            <section className={`view view-chat${hide('ai-chat')}`}>
              <div className="view-header">
                <div>
                  <h2>AI Assistant Chatbot</h2>
                  <p>Ask for help with attendance monitoring and class records.</p>
                </div>
                <button className="btn btn-outline" onClick={clearChat}>
                  <i className="fa-solid fa-rotate-left"></i> Clear Chat
                </button>
              </div>

              <div className="chat-messages" ref={chatRef}>
                {messages.map((m, i) =>
                  m.role === 'user' ? (
                    <div className="chat-row user" key={i}>
                      <div className="chat-bubble user">
                        <p>{m.text}</p>
                      </div>
                      <div className="chat-avatar user">YOU</div>
                    </div>
                  ) : (
                    <div className="chat-row" key={i}>
                      <div className="chat-avatar ai">AI</div>
                      <div className="chat-bubble ai">
                        <p style={{ whiteSpace: 'pre-wrap' }}>{m.text}</p>
                      </div>
                    </div>
                  )
                )}

                {loading && (
                  <div className="chat-row">
                    <div className="chat-avatar ai">AI</div>
                    <div className="chat-bubble ai loading">
                      <span className="dot-bounce"></span>
                      <span className="dot-bounce"></span>
                      <span className="dot-bounce"></span>
                    </div>
                  </div>
                )}
              </div>

              <form className="chat-form" onSubmit={submitChat}>
                <input
                  type="text"
                  placeholder="Ask about attendance for your class..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                  <span>Send</span> <i className="fa-solid fa-paper-plane"></i>
                </button>
              </form>
            </section>
          </main>
        </div>
      </div>

      <div className={`modal-overlay${modalOpen ? '' : ' hidden'}`}>
        <div className="modal-card">
          <div className="modal-head">
            <div className="modal-title-wrap">
              <div className="logo-box sm">CC</div>
              <div className="brand-text">
                <h3>Create New Class</h3>
                <p>Set up course details for QR attendance</p>
              </div>
            </div>
            <button className="icon-btn" onClick={() => setModalOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form id="create-class-form" onSubmit={submitClass}>
            <label>Class Name</label>
            <input
              type="text"
              placeholder="e.g. Advanced Data Structures"
              required
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />

            <div className="grid-2">
              <div>
                <label>Subject Code</label>
                <input
                  type="text"
                  className="mono upper"
                  placeholder="e.g. CS-302"
                  required
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                />
              </div>
              <div>
                <label>Section / Room</label>
                <input
                  type="text"
                  placeholder="e.g. Room 402"
                  required
                  value={classSection}
                  onChange={(e) => setClassSection(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-dark btn-block">
              Create Class Session
            </button>
          </form>
        </div>
      </div>

      {toastContainer}
    </>
  )
}