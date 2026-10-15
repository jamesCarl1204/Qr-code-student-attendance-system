import { useEffect, useRef } from 'react'
import s from '../TeacherPortal.module.css'
import useAiChat from '../hooks/useAiChat'

export default function AiChatView({ showToast }) {
  const { messages, prompt, setPrompt, loading, submit, clear } = useAiChat({ showToast })
  const chatRef = useRef(null)

  useEffect(() => {
    const el = chatRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  return (
    <section className={`${s.view} ${s.viewChat}`}>
      <div className={s.viewHeader}>
        <div>
          <h2>AI Assistant Chatbot</h2>
          <p>Ask for help with attendance monitoring and class records.</p>
        </div>
        <button className="btn btn-outline" onClick={clear}>
          <i className="fa-solid fa-rotate-left"></i> Clear Chat
        </button>
      </div>

      <div className={s.chatMessages} ref={chatRef}>
        {messages.map((m, i) =>
          m.role === 'user' ? (
            <div className={`${s.chatRow} ${s.chatRowUser}`} key={i}>
              <div className={`${s.bubble} ${s.bubbleUser}`}>{m.text}</div>
              <div className={`${s.avatar} ${s.avatarUser}`}>YOU</div>
            </div>
          ) : (
            <div className={s.chatRow} key={i}>
              <div className={`${s.avatar} ${s.avatarAi}`}>AI</div>
              <div className={`${s.bubble} ${s.bubbleAi}`}>{m.text}</div>
            </div>
          )
        )}

        {loading && (
          <div className={s.chatRow}>
            <div className={`${s.avatar} ${s.avatarAi}`}>AI</div>
            <div className={`${s.bubble} ${s.bubbleAi} ${s.bubbleLoading}`}>
              <span className={s.dot}></span>
              <span className={s.dot}></span>
              <span className={s.dot}></span>
            </div>
          </div>
        )}
      </div>

      <form className={s.chatForm} onSubmit={submit}>
        <input
          type="text"
          className="input"
          placeholder="Ask about attendance for your class..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          <span>Send</span> <i className="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </section>
  )
}
