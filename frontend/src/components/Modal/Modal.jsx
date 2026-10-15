import s from './Modal.module.css'

export default function Modal({ open, onClose, mark, title, subtitle, children }) {
  if (!open) return null

  return (
    <div className={s.overlay}>
      <div className={s.card}>
        <div className={s.head}>
          <div className={s.titleWrap}>
            <div className={s.mark}>{mark}</div>
            <div>
              <h3 className={s.title}>{title}</h3>
              <p className={s.subtitle}>{subtitle}</p>
            </div>
          </div>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
