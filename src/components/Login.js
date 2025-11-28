import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './../AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, setRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('https://localhost:7014/api/Auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setToken(data.token);
      setRole(data.role); // el backend debe enviar el rol en la respuesta
      navigate('/dashboard');
    } else {
      alert(data.message || 'Error en login');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src="/logo.png" alt="Logo" style={styles.logo} />
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} style={styles.input} required />
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} style={styles.input} required />
          <button type="submit" style={styles.button}>Ingresar</button>
        </form>
      </div>
    </div>
  );
}

// estilos inline (igual que antes)
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' },
  card: { width: 350, padding: 30, borderRadius: 10, boxShadow: '0 4px 15px rgba(0,0,0,0.2)', background: '#fff', textAlign: 'center' },
  logo: { width: 100, marginBottom: 20 },
  form: { display: 'flex', flexDirection: 'column' },
  input: { marginBottom: 15, padding: 10, borderRadius: 5, border: '1px solid #ccc', fontSize: 16 },
  button: { padding: 10, borderRadius: 5, border: 'none', background: '#007bff', color: '#fff', fontSize: 16, cursor: 'pointer' },
};
