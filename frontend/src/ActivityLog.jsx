import React, { useEffect, useState } from 'react';
const API = 'http://localhost/project_management/backend';
export default function ActivityLog(){
  const [acts, setActs] = useState([]);
  useEffect(()=> {
    fetch(`${API}/activity_list.php`).then(r=>r.json()).then(setActs).catch(()=>{});
  },[]);
  return (
    <div className="bg-white p-3 rounded shadow mt-3">
      <h3 className="font-semibold mb-2">Activity Log</h3>
      <ul className="text-sm">
        {acts.map(a=>(
          <li key={a.id} className="mb-1"><b>{a.username}</b>: {a.action} <span className="text-xs text-gray-500">- {new Date(a.created_at).toLocaleString()}</span></li>
        ))}
      </ul>
    </div>
  )
}
