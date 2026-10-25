import s from '../TeacherPortal.module.css'
import EmptyState from '../../../components/EmptyState/EmptyState'
import ClassCard from '../components/ClassCard'

function schoolYear() {
  const d = new Date()
  const start = d.getMonth() >= 5 ? d.getFullYear() : d.getFullYear() - 1
  return `${start}–${start + 1}`
}

export default function ClassesView({ classes, loading, onCreate, onOpen, onArchive, onDelete }) {
  const list = classes.filter((c) => !c.archived)

  return (
    <section className={s.view}>
      <div className={s.viewHeader}>
        <div>
          <h2>My Subjects</h2>
          <p>
            {list.length} active class{list.length === 1 ? '' : 'es'} · School Year {schoolYear()}
          </p>
        </div>
      </div>

      {!loading && list.length === 0 ? (
        <EmptyState
          icon="fa-book-open"
          title="No classes created yet"
          text={`You haven't set up any active classes. Use "Create Class" above to start generating QR attendance sessions.`}
        >
          <button className="btn btn-primary" onClick={onCreate}>
            Create a Class Now
          </button>
        </EmptyState>
      ) : (
        <div className={s.grid}>
          {list.map((c) => (
            <ClassCard key={c.id} c={c} onOpen={onOpen} onArchive={onArchive} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  )
}