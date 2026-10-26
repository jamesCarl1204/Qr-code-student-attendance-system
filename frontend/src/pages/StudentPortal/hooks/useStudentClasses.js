import { useCallback, useEffect, useState } from 'react'
import { getJson, patchJson } from '../../../api/client'

export default function useStudentClasses() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    try {
      const data = await getJson('/api/student/classes')
      if (data.success) setClasses(data.classes)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const leave = async (id) => {
    const data = await patchJson(`/api/student/classes/${id}/leave`, {})
    if (data.success) await reload()
    return data
  }

  return { classes, loading, reload, leave }
}