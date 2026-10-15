import s from '../TeacherPortal.module.css'
import EmptyState from '../../../components/EmptyState/EmptyState'

export default function ArchivedView() {
  return (
    <section className={s.view}>
      <div className={s.viewHeader}>
        <div>
          <h2>Archived Class</h2>
          <p>Previous semester or completed courses.</p>
        </div>
      </div>

      <EmptyState
        icon="fa-box-archive"
        title="No archived classes"
        text="Archived courses from previous terms will appear here."
      />
    </section>
  )
}
