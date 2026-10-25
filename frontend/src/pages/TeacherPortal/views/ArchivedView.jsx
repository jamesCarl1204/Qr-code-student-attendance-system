import s from '../TeacherPortal.module.css'
import EmptyState from '../../../components/EmptyState/EmptyState'
import ClassCard from '../components/ClassCard'

export default function ArchivedView({ classes, loading, onOpen, onArchive, onDelete }) {
  const list = classes.filter((c) => c.archived)

  return (
    <section className={s.view}>
      <div className={s.viewHeader}>
        <div>
          <h2>Archived Classes</h2>
          <p>
            {list.length} archived class{list.length === 1 ? '' : 'es'} · Previous semester or
            completed courses.
          </p>
        </div>
      </div>

      {!loading && list.length === 0 ? (
        <EmptyState
          icon="fa-box-archive"
          title="No archived classes"
          text="Archived courses from previous terms will appear here."
        />
      ) : (
        <div className={s.grid}>
          {list.map((c) => (
            <ClassCard
              key={c.id}
              c={c}
              onOpen={onOpen}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  )
}