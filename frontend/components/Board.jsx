import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const API = '/backend/api';

export default function Board({ user }) {
    const [tasks, setTasks] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');

    useEffect(() => { fetchTasks(); const id = setInterval(fetchTasks, 5000); return () => clearInterval(id); }, []);

    async function fetchTasks() {
        try {
            const res = await fetch(`${API}/tasks.php`);
            const data = await res.json();
            setTasks(data);
        } catch (e) { console.error(e); }
    }

    async function addTask() {
        if (!newTitle) return alert('Title required');
        await fetch(`${API}/tasks.php`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle, description: newDesc, status: 'To Do' })
        });
        setNewTitle(''); setNewDesc('');
        fetchTasks();
        if (user) await fetch(`${API}/add_activity.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.id, action: `Created task: ${newTitle}` }) });
    }

    async function onDragEnd(result) {
        if (!result.destination) return;
        const id = result.draggableId;
        const newStatus = result.destination.droppableId;
        await fetch(`${API}/update_status.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: newStatus }) });
        fetchTasks();
        if (user) await fetch(`${API}/add_activity.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.id, action: `Moved task ${id} to ${newStatus}` }) });
    }

    const columns = {
        'To Do': tasks.filter(t => t.status === 'To Do'),
        'In Progress': tasks.filter(t => t.status === 'In Progress'),
        'Completed': tasks.filter(t => t.status === 'Completed'),
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input placeholder="Task title" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ flex: 1, padding: 8 }} />
                <input placeholder="Task description" value={newDesc} onChange={e => setNewDesc(e.target.value)} style={{ width: 300, padding: 8 }} />
                <button onClick={addTask}>Add Task</button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div style={{ display: 'flex', gap: 12 }}>
                    {Object.keys(columns).map(col => (
                        <Droppable droppableId={col} key={col}>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} style={{ background: '#f3f4f6', padding: 12, borderRadius: 8, minWidth: 260, minHeight: 300 }}>
                                    <h3>{col}</h3>
                                    {columns[col].map((task, index) => (
                                        <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                                            {(prov) => (
                                                <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}
                                                    style={{ padding: 10, margin: '8px 0', background: '#fff', borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', ...prov.draggableProps.style }}>
                                                    <div style={{ fontWeight: 600 }}>{task.title}</div>
                                                    <div style={{ fontSize: 13, color: '#444' }}>{task.description}</div>
                                                    <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>Assigned: {task.assigned_name || '—'}</div>
                                                    <div style={{ marginTop: 8 }}>
                                                        {task.comments?.map((c, i) => (<div key={i} style={{ fontSize: 13 }}><b>{c.username}</b>: {c.comment}</div>))}
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
        </div>
    )
}
