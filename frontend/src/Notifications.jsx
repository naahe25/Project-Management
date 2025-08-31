import React, { useEffect, useState } from 'react';
const API = 'http://localhost/project_management/backend';
export default function Notifications({ user }) {
  const [notes, setNotes] = useState([]);
  useEffect(()=> {
    if(!user) return;
    const fetchNotes = ()=> fetch(`${API}/get_notifications.php?user_id=${user.id}`).then(r=>r.json()).then(setNotes).catch(()=>{});
    fetchNotes();
    const id = setInterval(fetchNotes, 5000);
    return ()=>clearInterval(id);
  },[user]);
  const mark = async (id)=> {
    await fetch(`${API}/mark_read.php`, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id})});
    setNotes(n=>n.map(x=> x.id===id? {...x, is_read:1}:x));
  }
  return (
    <div className="bg-white p-3 rounded shadow">
      <h3 className="font-semibold mb-2">Notifications</h3>
      {notes.length===0 && <div className="text-sm text-gray-500">No notifications</div>}
      <ul>
        {notes.map(n=>(
          <li key={n.id} className={`text-sm mb-2 ${n.is_read? 'text-gray-400':'text-black'}`}>
            <div>{n.type} <span className="text-xs text-gray-500">- {new Date(n.created_at).toLocaleString()}</span></div>
            <div className="text-xs">{n.payload? JSON.stringify(JSON.parse(n.payload)):''}</div>
            {!n.is_read && <button className="text-blue-600 text-xs" onClick={()=>mark(n.id)}>Mark read</button>}
          </li>
        ))}
      </ul>
    </div>
  )
}
