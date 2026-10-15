import s from '../StudentPortal.module.css'
import EmptyState from '../../../components/EmptyState/EmptyState'

export default function ArchivedView() {
  return (
    <section className={s.view}>
      <div className={s.viewHeader}>
        <h2>Archived Class</h2>
        <p className={s.viewSubtitle}>Previous semester or completed courses.</p>
      </div>

      <EmptyState
        icon="fa-box-archive"
        title="No archived classes"
        text="Archived courses from past terms will appear here."
      />
    </section>
  )
}
