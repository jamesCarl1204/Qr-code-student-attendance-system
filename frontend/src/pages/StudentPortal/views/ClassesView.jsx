import s from '../StudentPortal.module.css'
import EmptyState from '../../../components/EmptyState/EmptyState'
import StudentClassList from '../components/StudentClassList'

export default function ClassesView({ classes, loading, onJoin, onLeave, onOpen }) {
  const list = classes.filter((c) => !c.archived)

  return (
    <section className={s.view}>
      <div className={s.viewHeader}>
        <h2>Classes</h2>
        <p className={s.viewSubtitle}>Enrolled courses and attendance logs.</p>
      </div>

      {!loading && list.length === 0 ? (
        <EmptyState
          icon="fa-book-open"
          title="No classes enrolled yet"
          text='You are not currently enrolled in any classes. Use "Join Class" above to get started.'
        >
          <button className="btn btn-primary" onClick={onJoin}>
            Join a Class Now
          </button>
        </EmptyState>
      ) : (
        <StudentClassList classes={list} onLeave={onLeave} onOpen={onOpen} />
      )}
    </section>
  )
}