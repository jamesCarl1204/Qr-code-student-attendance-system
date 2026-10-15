import s from './Topbar.module.css'

// children = mga buttons sa kanan (Join Class, Logout, etc.)
export default function Topbar({ mark, title, subtitle, children }) {
  return (
    <header className={s.topbar}>
      <div className={s.brand}>
        <div className={s.mark}>{mark}</div>
        <div>
          <h1 className={s.title}>{title}</h1>
          <p className={s.subtitle}>{subtitle}</p>
        </div>
      </div>
      <div className={s.actions}>{children}</div>
    </header>
  )
}
