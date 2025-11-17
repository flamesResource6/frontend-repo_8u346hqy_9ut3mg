import { useState } from 'react'
import Generator from './components/Generator'
import TestList from './components/TestList'

function App() {
  const [savedId, setSavedId] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-sky-50">
      <header className="px-6 py-4 border-b bg-white/70 backdrop-blur sticky top-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">AI Test Maker for Teachers</h1>
          <a href="/test" className="text-sm text-blue-700 hover:underline">Check backend</a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Generate a test</h2>
          <Generator onSaveSuccess={setSavedId} />
          {savedId && (
            <div className="mt-4 text-emerald-700">Saved! ID: {savedId}</div>
          )}
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your saved tests</h2>
          <TestList />
        </section>
      </main>

      <footer className="text-center text-xs text-gray-500 py-6">Built with Vibe Coding</footer>
    </div>
  )
}

export default App
