import { useState } from 'react'
import s from '../TeacherPortal.module.css'
import { CLASS_COLORS } from '../classColors'

export default function ClassCard({ c, onOpen, onArchive, onDelete }) {
  const [copied, setCopied] = useState(false)
  const color = CLASS_COLORS[c.color] || CLASS_COLORS.blue

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(c.classCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard blocked
    }
  }

  return (
    <article className={s.classCard} style={{ '--accent': color }}>
      <div className={s.cardTop}>
        <div>
          <h3>{c.subjectName}</h3>
          <p className={s.classMeta}>{c.section || 'No section'}</p>
        </div>
        <div className={s.cardIcon}>
          <i className="fa-solid fa-book"></i>
        </div>
      </div>

      <div className={s.cardInfo}>
        <button type="button" className={s.code} onClick={copyCode} title="Click to copy">
          {copied ? 'Copied!' : <b>{c.classCode}</b>}
        </button>
        <span className={s.students}>
          <i className="fa-solid fa-user-group"></i> {c.studentCount} student
          {Number(c.studentCount) === 1 ? '' : 's'}
        </span>
      </div>

      <button type="button" className={s.openBtn} onClick={() => onOpen(c)}>
        Open class <i className="fa-solid fa-chevron-right"></i>
      </button>

      <div className={s.classActions}>
        <button type="button" className="btn btn-outline" onClick={() => onArchive(c)}>
          {c.archived ? 'Restore' : 'Archive'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => onDelete(c)}>
          Delete
        </button>
      </div>
    </article>
  )
}