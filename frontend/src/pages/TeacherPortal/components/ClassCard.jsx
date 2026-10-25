import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import s from '../TeacherPortal.module.css'
import { CLASS_COLORS } from '../classColors'

export default function ClassCard({ cls, archived, onToggleArchive }) {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const color = CLASS_COLORS[cls.color] || CLASS_COLORS.blue

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(cls.class_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard blocked, ignore
    }
  }

  return (
    <article className={s.classCard}>
      <div className={s.classBar} style={{ background: color }} />
      <div className={s.classBody}>
        <h3 className={s.classSubject}>{cls.subject_name}</h3>
        <p className={s.classBlock}>{cls.section}</p>
        <button type="button" className={s.codePill} onClick={copyCode} title="Click to copy">
          {copied ? 'Copied!' : cls.class_code}
        </button>
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => navigate(`/teacher/classes/${cls.id}`)}
        >
          Open class <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
      <div className={s.classFoot}>
        <span>
          <i className="fa-solid fa-user-group"></i> {cls.student_count} student
          {Number(cls.student_count) === 1 ? '' : 's'}
        </span>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => onToggleArchive(cls, !archived)}
        >
          {archived ? 'Restore' : 'Archive'}
        </button>
      </div>
    </article>
  )
}