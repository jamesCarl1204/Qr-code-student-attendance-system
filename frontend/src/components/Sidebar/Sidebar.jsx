import s from './Sidebar.module.css'

// navItems: [{ key, icon, label }]
export default function Sidebar({ navItems, tab, onChange, statusTitle, statusText }) {
  return (
    <aside className={s.sidebar}>
      <nav className={s.nav}>
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`${s.item} ${tab === item.key ? s.active : ''}`}
            onClick={() => onChange(item.key)}
          >
            <i className={`fa-solid ${item.icon}`}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className={s.status}>
        <p className={s.statusTitle}>{statusTitle}</p>
        <p className={s.statusText}>{statusText}</p>
      </div>
    </aside>
  )
}
