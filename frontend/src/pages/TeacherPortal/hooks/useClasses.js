import { useCallback, useEffect, useState } from 'react'
import { getJson, patchJson, deleteJson } from '../../../api/client'

export default function useClasses() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    try {
      const data = await getJson('/api/teacher/classes')
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

  const archive = async (id, archived) => {
    const data = await patchJson(`/api/teacher/classes/${id}/archive`, { archived })
    if (data.success) await reload()
    return data
  }

  const remove = async (id) => {
    const data = await deleteJson(`/api/teacher/classes/${id}`)
    if (data.success) await reload()
    return data
  }

  return { classes, loading, reload, archive, remove }
}