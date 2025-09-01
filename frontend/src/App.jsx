import React, { useState, useEffect } from 'react';
import Login from './Login.jsx';
import Board from '../components/Board.jsx';

export default function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check session
        fetch('/backend/auth/session.php').then(r => r.json()).then(d => {
            if (d.user) setUser(d.user);
        }).catch(() => { });
    }, []);

    return (
        <div style={{ maxWidth: 1100, margin: '20px auto', padding: 20 }}>
            {!user ? <Login onLogin={setUser} /> :
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <h2>Project Management Tool</h2>
                        <div>
                            <span style={{ marginRight: 12 }}>Hi, {user.username} ({user.role})</span>
                            <button onClick={async () => {
                                await fetch('/backend/auth/logout.php');
                                setUser(null);
                            }}>Logout</button>
                        </div>
                    </div>
                    <Board user={user} />
                </div>}
        </div>
    )
}
