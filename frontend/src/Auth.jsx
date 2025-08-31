import React, { useState } from 'react'

const API_BASE = 'http://localhost/project_management/backend'

export default function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ username:'', email:'', password:'' })

  const submit = async () => {
    const url = isLogin ? `${API_BASE}/login.php` : `${API_BASE}/register.php`
    const body = isLogin ? { email: form.email, password: form.password } : form
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    if (data.user_id) setUser({ id: data.user_id, username: data.username })
    else alert(data.message || data.error || 'Action failed')
  }

  return (
    <div className="max-w-sm mx-auto bg-white p-4 rounded-2xl shadow mt-6">
      <h2 className="text-xl font-bold mb-3">{isLogin ? 'Login' : 'Register'}</h2>
      {!isLogin && (
        <input className="w-full border p-2 rounded mb-2" placeholder="Username"
          onChange={(e)=>setForm({...form, username:e.target.value})}/>
      )}
      <input className="w-full border p-2 rounded mb-2" placeholder="Email" type="email"
        onChange={(e)=>setForm({...form, email:e.target.value})}/>
      <input className="w-full border p-2 rounded mb-2" placeholder="Password" type="password"
        onChange={(e)=>setForm({...form, password:e.target.value})}/>
      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" onClick={submit}>
        {isLogin ? 'Login' : 'Register'}
      </button>
      <p className="text-sm mt-3 text-center cursor-pointer underline"
        onClick={()=>setIsLogin(!isLogin)}>
        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
      </p>
    </div>
  )
}
