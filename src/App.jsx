import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import TasksPage from './pages/TasksPage'
import NotesPage from './pages/NotesPage'

export default function App() {
  return (
    <div className="wrap">
      <nav className="topnav">
        <h1 className="brand">MyTasks</h1>
        <div>
          <Link to="/" className="navlink">Tasks</Link>
          <Link to="/notes" className="navlink">Notes</Link>
        </div>
      </nav>
      <main className="main">
        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/notes" element={<NotesPage />} />
        </Routes>
      </main>
    </div>
  )
}
