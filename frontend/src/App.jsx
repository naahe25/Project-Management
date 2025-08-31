import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Dashboard from './Dashboard.jsx'
import Auth from './Auth.jsx'
import UsersPanel from './UsersPanel.jsx'
import Notifications from './Notifications.jsx'
import ActivityLog from './ActivityLog.jsx'

const API_BASE = 'http://localhost/project_management/backend'

export default function App(){
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [commentInput, setCommentInput] = useState({})
  const [newTask, setNewTask] = useState({ title:'', description:'', status:'To Do', assigned_to:null })

  const fetchTasks = async () => {
    try{
      const res = await fetch(`${API_BASE}/tasks.php`)
      const data = await res.json()
      setTasks(data)
    }catch(e){ console.error(e) }
  }

  useEffect(()=>{ fetchTasks(); const id=setInterval(fetchTasks, 5000); return ()=>clearInterval(id) },[])

  const logActivity = async (action) => {
    if(!user) return;
    try{
      await fetch(`${API_BASE}/add_activity.php`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ user_id: user.id, action })
      })
    }catch(e){ console.error(e) }
  }

  const addTask = async () => {
    if(!newTask.title) return alert('Title required')
    try{
      const res = await fetch(`${API_BASE}/tasks.php`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(newTask)
      })
      const data = await res.json()
      if(data.id){
        setNewTask({ title:'', description:'', status:'To Do', assigned_to:null })
        await logActivity(`Created task #${data.id}`)
        fetchTasks()
      } else {
        alert(data.error || 'Failed to create task')
      }
    }catch(e){ console.error(e) }
  }

  const onDragEnd = async (result) => {
    if(!result.destination) return
    const { draggableId, destination } = result
    const newStatus = destination.droppableId
    try{
      await fetch(`${API_BASE}/update_status.php`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ id: draggableId, status: newStatus })
      })
      await logActivity(`Moved task ID ${draggableId} to ${newStatus}`)
      fetchTasks()
    }catch(e){ console.error(e) }
  }

  const addComment = async (taskId) => {
    const comment = commentInput[taskId]
    if(!comment || !user) return
    try{
      await fetch(`${API_BASE}/add_comment.php`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ task_id: taskId, user_id: user.id, comment })
      })
      await logActivity(`Commented on task ID ${taskId}`)
      setCommentInput(prev=>({ ...prev, [taskId]: '' }))
      fetchTasks()
    }catch(e){ console.error(e) }
  }

  const columns = {
    'To Do': tasks.filter(t=>t.status==='To Do'),
    'In Progress': tasks.filter(t=>t.status==='In Progress'),
    'Completed': tasks.filter(t=>t.status==='Completed'),
  }

  if(!user){
    return (
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">📋 Project Management Board</h1>
        <Auth setUser={setUser} />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">📋 Project Management Board</h1>
        <div className="text-sm">Logged in as <b>{user.username}</b></div>
      </div>

      <div className="flex gap-4 mb-4">
        <Dashboard />
        <Notifications user={user} />
        <UsersPanel />
      </div>

      {/* Create Task */}
      <div className="bg-white rounded-2xl shadow p-4 mb-4">
        <h3 className="font-semibold mb-2">Create Task</h3>
        <div className="grid md:grid-cols-4 gap-2">
          <input className="border p-2 rounded" placeholder="Title" value={newTask.title}
            onChange={e=>setNewTask({...newTask, title:e.target.value})} />
          <input className="border p-2 rounded" placeholder="Description" value={newTask.description}
            onChange={e=>setNewTask({...newTask, description:e.target.value})} />
          <select className="border p-2 rounded" value={newTask.status}
            onChange={e=>setNewTask({...newTask, status:e.target.value})}>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <button className="bg-green-600 text-white rounded px-4" onClick={addTask}>Add Task</button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row gap-4">
          {Object.keys(columns).map(col => (
            <Droppable droppableId={col} key={col}>
              {(provided) => (
                <div className="flex-1 bg-gray-100 rounded-2xl p-3 min-h-[300px]"
                  ref={provided.innerRef} {...provided.droppableProps}>
                  <h2 className="text-lg font-bold mb-2">{col}</h2>
                  {columns[col].map((task, index) => (
                    <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                          className="bg-white rounded shadow p-3 mb-3">
                          <div className="font-semibold">{task.title}</div>
                          <div className="text-sm text-gray-700">{task.description}</div>
                          <div className="text-xs text-gray-500">Assigned to: {task.assigned_to || '—'}</div>
                          <div className="mt-2">
                            <div className="font-semibold">Comments</div>
                            {task.comments?.map((c, i)=>(
                              <div key={i} className="text-sm"><b>{c.username}</b>: {c.comment}</div>
                            ))}
                            <div className="flex gap-2 mt-2">
                              <input className="border p-1 rounded flex-1" placeholder="Add comment"
                                value={commentInput[task.id] || ''}
                                onChange={e=>setCommentInput(prev=>({ ...prev, [task.id]: e.target.value }))}/>
                              <button className="bg-blue-600 text-white px-3 rounded"
                                onClick={()=>addComment(task.id)}>Add</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <ActivityLog />
    </div>
  )
}
