import React, { useEffect, useState } from 'react';
const API = 'http://localhost/project_management/backend';
export default function UsersPanel({ onSelect }) {
  const [users, setUsers] = useState([]);
  useEffect(()=> {
    fetch(`${API}/users.php`).then(r=>r.json()).then(setUsers).catch(()=>{});
  },[]);
  return (
    <div className="bg-white p-3 rounded shadow">
      <h3 className="font-semibold mb-2">Team Members</h3>
      <ul>
        {users.map(u=>(
          <li key={u.id} className="text-sm mb-1">{u.username} <span className="text-xs text-gray-500">({u.email})</span></li>
        ))}
      </ul>
    </div>
  )
}
