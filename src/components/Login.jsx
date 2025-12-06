import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../axiosConfig";
import { AuthContext } from '../AuthContext';
import logo2 from './../logo2.svg';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, setRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const { data } = await api.post("/Auth/login", {
      username,
      password
    });

    // Si la respuesta es exitosa
    setToken(data.token);
    setRole(data.role); // el backend debe enviar el rol
    navigate('/dashboard');
    
  } catch (err) {
    // Manejo de errores
    alert(err.response?.data?.message || 'Error en login');
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src={logo2} alt="Logo" style={styles.logo} />
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
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f0f0ff' },
  card: { width: 350, padding: 30, borderRadius: 10, boxShadow: '0 4px 15px rgba(0,0,0,0.2)', background: '#fff', textAlign: 'center' },
  logo: { width: 200, },
  form: { display: 'flex', flexDirection: 'column' },
  input: { marginBottom: 15, padding: 10, borderRadius: 5, border: '1px solid #ccc', fontSize: 16, "background-color": '#fff8d3ff' },
  button: { padding: 10, borderRadius: 5, border: 'none', background: '#ff0000ff', color: '#fff', fontSize: 16, cursor: 'pointer' },
};
