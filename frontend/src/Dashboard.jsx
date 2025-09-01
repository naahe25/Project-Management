import React, { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

const API_BASE = 'http://localhost/project_management/backend'

export default function Dashboard(){
  const [stats, setStats] = useState({ 'To Do':0, 'In Progress':0, 'Completed':0 })
  useEffect(()=>{
    fetch(`${API_BASE}/stats.php`).then(r=>r.json()).then(setStats).catch(()=>{})
  },[])

  const data = {
    labels: ['To Do','In Progress','Completed'],
    datasets:[{
      data: [stats['To Do']||0, stats['In Progress']||0, stats['Completed']||0],
      backgroundColor: ['#ef4444','#3b82f6','#10b981']
    }]
  }

  return (
    <div className="w-full md:w-1/3 bg-white p-4 rounded-2xl shadow mb-4">
      <h2 className="text-2xl font-bold mb-3">Project Dashboard</h2>
      <Pie data={data} />
    </div>
  )
}
