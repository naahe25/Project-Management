import React, { useState } from 'react';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registerMode, setRegisterMode] = useState(false);
    const [username, setUsername] = useState('');

    const submit = async () => {
        try {
            if (registerMode) {
                const res = await fetch('/backend/auth/register.php', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });
                const d = await res.json();
                if (d.user_id) { alert('Registered. Now login.'); setRegisterMode(false); }
                else alert(d.error || d.message);
            } else {
                const res = await fetch('/backend/auth/login.php', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const d = await res.json();
                if (d.user) onLogin(d.user); else alert(d.error || d.message);
            }
        } catch (e) { alert('Error'); console.error(e); }
    }

    return (
        <div style={{ maxWidth: 420, margin: '40px auto', padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            <h3>{registerMode ? 'Register' : 'Login'}</h3>
            {registerMode && <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />}
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
            <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
            <button onClick={submit} style={{ padding: '8px 12px' }}>{registerMode ? 'Register' : 'Login'}</button>
            <div style={{ marginTop: 10 }}>
                <a href="#" onClick={(e) => { e.preventDefault(); setRegisterMode(!registerMode); }}>{registerMode ? 'Have an account? Login' : 'Need an account? Register'}</a>
            </div>
        </div>
    )
}
