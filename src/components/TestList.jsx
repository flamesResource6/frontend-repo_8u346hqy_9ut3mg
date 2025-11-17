import { useEffect, useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function TestList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BACKEND}/api/tests`)
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setItems(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map(t => (
        <div key={t.id} className="border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="font-semibold text-lg">{t.title}</h3>
          <p className="text-sm text-gray-600">{t.description}</p>
          <div className="text-xs text-gray-500 mt-2">{t.subject} • {t.grade_level} • {t.questions?.length || 0} questions</div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="text-gray-600">No tests yet. Generate one to get started.</div>
      )}
    </div>
  )
}
