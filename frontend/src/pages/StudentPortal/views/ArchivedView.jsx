import s from '../StudentPortal.module.css'
import EmptyState from '../../../components/EmptyState/EmptyState'
import StudentClassList from '../components/StudentClassList'

export default function ArchivedView({ classes, loading, onLeave, onOpen }) {
  const list = classes.filter((c) => c.archived)

  return (
    <section className={s.view}>
      <div className={s.viewHeader}>
        <h2>Archived Class</h2>
        <p className={s.viewSubtitle}>Previous semester or completed courses.</p>
      </div>

      {!loading && list.length === 0 ? (
        <EmptyState
          icon="fa-box-archive"
          title="No archived classes"
          text="Archived courses from past terms will appear here."
        />
      ) : (
        <StudentClassList classes={list} onLeave={onLeave} onOpen={onOpen} />
      )}
    </section>
  )
}