import { useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Generator({ onSaveSuccess }) {
  const [topic, setTopic] = useState('Photosynthesis')
  const [grade, setGrade] = useState('Grade 8')
  const [num, setNum] = useState(5)
  const [type, setType] = useState('mixed')
  const [loading, setLoading] = useState(false)
  const [test, setTest] = useState(null)
  const [error, setError] = useState(null)

  const generate = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BACKEND}/api/tests/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, grade_level: grade, num_questions: Number(num), question_type: type })
      })
      if (!res.ok) throw new Error('Failed to generate')
      const data = await res.json()
      setTest(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const save = async () => {
    if (!test) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BACKEND}/api/tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test)
      })
      if (!res.ok) throw new Error('Failed to save')
      const data = await res.json()
      onSaveSuccess?.(data.id)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input className="border rounded px-3 py-2" value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Topic" />
        <input className="border rounded px-3 py-2" value={grade} onChange={e=>setGrade(e.target.value)} placeholder="Grade level" />
        <input type="number" className="border rounded px-3 py-2" value={num} min={1} max={50} onChange={e=>setNum(e.target.value)} />
        <select className="border rounded px-3 py-2" value={type} onChange={e=>setType(e.target.value)}>
          <option value="mcq">Multiple Choice</option>
          <option value="short">Short Answer</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button onClick={generate} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60" disabled={loading}>{loading ? 'Generating...' : 'Generate'}</button>
        <button onClick={save} className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-60" disabled={!test || loading}>Save</button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {test && (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="text-xl font-semibold mb-2">{test.title}</h3>
          <p className="text-gray-600 mb-4">{test.description}</p>
          <ol className="space-y-4 list-decimal pl-5">
            {test.questions?.map((q, i) => (
              <li key={i} className="">
                <p className="font-medium mb-1">{q.text}</p>
                {q.type === 'mcq' && (
                  <ul className="list-disc pl-5 text-sm text-gray-700">
                    {q.options?.map((opt, j) => (
                      <li key={j}>{opt}</li>
                    ))}
                  </ul>
                )}
                {q.type === 'short' && (
                  <p className="text-sm text-gray-700 italic">Suggested answer: {q.answer_text}</p>
                )}
                <div className="text-xs text-gray-500 mt-1">Bloom: {q.bloom_level || '—'} • Points: {q.points}</div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
