import React, { useEffect, useState } from 'react'
import API from '../api'



function TaskForm({ onSaved, editTarget }) {
  const [title, setTitle] = useState(editTarget?.title || '')
  const [desc, setDesc] = useState(editTarget?.description || '')
  const [status, setStatus] = useState(editTarget?.status || 'Pending')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(editTarget?.image ? '/uploads/' + editTarget.image : null)
  const [error, setError] = useState('')

  useEffect(()=>{
    setTitle(editTarget?.title || '')
    setDesc(editTarget?.description || '')
    setStatus(editTarget?.status || 'Pending')
    setPreview(editTarget?.image ? '/uploads/' + editTarget.image : null)
    setFile(null)
    setError('')
  }, [editTarget])

  function onFile(e){
    const f = e.target.files[0]
    if (!f) return
    const ext = f.name.split('.').pop().toLowerCase()
    if (!['jpg','jpeg','png'].includes(ext)) { setError('Only JPG/PNG allowed'); return }
    if (f.size > 2 * 1024 * 1024) { setError('File must be < 2MB'); return }
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setError('')
  }

  async function handleSubmit(e){
    e.preventDefault()
    try {
      const form = new FormData()
      form.append('title', title)
      form.append('description', desc)
      form.append('status', status)
      if (file) form.append('image', file)
      if (editTarget) {
        const res = await API.put('/tasks/' + editTarget._id, form)
        onSaved(res.data)
      } else {
        const res = await API.post('/tasks', form)
        onSaved(res.data)
      }
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.error || 'Server error')
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>{editTarget ? 'Edit Task' : 'Add Task'}</h3>
      <input required placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} />
      <select value={status} onChange={e=>setStatus(e.target.value)}>
        <option>Pending</option>
        <option>Completed</option>
      </select>
      <input type="file" accept=".jpg,.jpeg,.png" onChange={onFile} />
      {preview && <div className="preview"><img src={preview} alt="preview" /></div>}
      {error && <div className="err">{error}</div>}
      <div className="row">
        <button className="btn">Save</button>
      </div>
    </form>
  )
}

export default function TasksPage(){
  const [tasks, setTasks] = useState([])
  const [editing, setEditing] = useState(null)

  async function load(){
    const res = await API.get('/tasks')
    setTasks(res.data)
  }
  useEffect(()=>{ load() }, [])

  async function onSaved(saved){
   
    setEditing(null)
    const idx = tasks.findIndex(t=>t._id===saved._id)
    if (idx>=0){ const copy = [...tasks]; copy[idx]=saved; setTasks(copy); }
    else setTasks([saved, ...tasks])
  }

  async function doDelete(id){
    if (!confirm('Delete this task?')) return
    await API.delete('/tasks/' + id)
    setTasks(tasks.filter(t=>t._id!==id))
  }

  return (
    <div className="grid">
      <div className="left">
        <TaskForm onSaved={onSaved} editTarget={editing} />
      </div>
      <div className="right">
        <h2>Tasks</h2>
        {tasks.length===0 && <div className="card">No tasks yet</div>}
        {tasks.map(t=>(
          <div key={t._id} className="card task-card">
            <div className="head">
              <strong>{t.title}</strong>
              <div className="actions">
                <button onClick={()=>setEditing(t)}>Edit</button>
                <button onClick={()=>doDelete(t._id)}>Delete</button>
              </div>
            </div>
            <p>{t.description}</p>
            <div>Status: {t.status}</div>
            {t.image && <img className="task-img" src={'/uploads/' + t.image} alt="task" />}
          </div>
        ))}
      </div>
    </div>
  )
}
