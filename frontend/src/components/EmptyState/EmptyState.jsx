import s from './EmptyState.module.css'

// children = optional action button
export default function EmptyState({ icon, title, text, children }) {
  return (
    <div className={s.empty}>
      <div className={s.icon}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div>
        <h3 className={s.title}>{title}</h3>
        <p className={s.text}>{text}</p>
      </div>
      {children}
    </div>
  )
}
