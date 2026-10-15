import s from '../TeacherPortal.module.css'
import EmptyState from '../../../components/EmptyState/EmptyState'

export default function ClassesView({ onCreate }) {
  return (
    <section className={s.view}>
      <div className={s.viewHeader}>
        <div>
          <h2>Classes</h2>
          <p>Active courses and attendance monitoring sessions.</p>
        </div>
      </div>

      <EmptyState
        icon="fa-book-open"
        title="No classes created yet"
        text={`You haven't set up any active classes. Use "Create Class" above to start generating QR attendance sessions.`}
      >
        <button className="btn btn-primary" onClick={onCreate}>
          Create a Class Now
        </button>
      </EmptyState>
    </section>
  )
}
