import s from './StudentClassList.module.css'
import { CLASS_COLORS } from '../../TeacherPortal/classColors'

export default function StudentClassList({ classes, onLeave, onOpen }) {
  return (
    <div className={s.grid}>
      {classes.map((c) => (
        <article className={s.card} key={c.id}>
          <div className={s.bar} style={{ background: CLASS_COLORS[c.color] || CLASS_COLORS.blue }} />
          <div className={s.body}>
            <h3 className={s.subject}>{c.subjectName}</h3>
            <p className={s.meta}>{c.section || 'No section'}</p>
            <p className={s.teacher}>
              <i className="fa-solid fa-chalkboard-user"></i> {(c.teacherName || '').trim()}
            </p>
          </div>
          <div className={s.foot}>
            <span className={s.code}>{c.classCode}</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button type="button" className="btn btn-primary" onClick={() => onOpen(c)}>
                Open
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => onLeave(c)}>
                Leave
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}