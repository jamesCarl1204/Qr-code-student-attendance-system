import s from '../TeacherPortal.module.css'
import { CLASS_COLORS } from '../classColors'

export default function ClassCard({ c, onOpen, onArchive, onDelete }) {
  return (
    <article
      className={s.classCard}
      style={{ '--accent': CLASS_COLORS[c.color] || CLASS_COLORS.blue }}
    >
      <div className={s.cardTop}>
        <div>
          <h3>{c.subjectName}</h3>
          <p className={s.classMeta}>{c.section || 'No section'}</p>
        </div>
        <div className={s.cardIcon}>
          <i className="fa-solid fa-book-open"></i>
        </div>
      </div>

      <div className={s.cardInfo}>
        <span className={s.code}>
          Code: <b>{c.classCode}</b>
        </span>
        <span className={s.students}>
          <i className="fa-solid fa-user-group"></i> {c.studentCount}
        </span>
      </div>

      <button className={s.openBtn} onClick={() => onOpen(c)}>
        <span>Open class</span>
        <i className="fa-solid fa-chevron-right"></i>
      </button>

      <div className={s.classActions}>
        <button className="btn btn-ghost" onClick={() => onArchive(c)}>
          <i className={`fa-solid ${c.archived ? 'fa-rotate-left' : 'fa-box-archive'}`}></i>
          {c.archived ? 'Restore' : 'Archive'}
        </button>
        <button className="btn btn-ghost" onClick={() => onDelete(c)}>
          <i className="fa-solid fa-trash"></i> Delete
        </button>
      </div>
    </article>
  )
}