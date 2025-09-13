import React, { useEffect, useState } from 'react'
import API from '../api'

export default function NotesPage(){
  const [notes, setNotes] = useState([])
  const [text, setText] = useState('')

  async function load(){ const res = await API.get('/notes'); setNotes(res.data) }
  useEffect(()=>{ load() }, [])

  async function addNote(e){
    e.preventDefault()
    if (!text.trim()) return
    const res = await API.post('/notes', { text })
    setNotes([res.data, ...notes])
    setText('')
  }

  async function del(id){
    if (!confirm('Delete note?')) return
    await API.delete('/notes/' + id)
    setNotes(notes.filter(n=>n._id!==id))
  }

  return (
    <div className="notes-wrap">
      <form className="card form" onSubmit={addNote}>
        <h3>New Note</h3>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Write..." />
        <div className="row"><button className="btn">Add Note</button></div>
      </form>
      <div className="notes-list">
        {notes.map(n=>(
          <div key={n._id} className="card note-card">
            <div className="note-top">
              <small>{new Date(n.createdAt).toLocaleString()}</small>
              <button onClick={()=>del(n._id)}>Delete</button>
            </div>
            <p>{n.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
