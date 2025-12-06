import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axiosConfig"; // tu configuración de axios

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/Auth/register", { username, password });

      // Si todo salió bien, mostrar mensaje y redirigir
      setMessage("Usuario registrado correctamente!");
      
      // Opcional: esperar un segundo y redirigir al login
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error al registrar usuario");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Registro</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Registrar</button>
        </form>
        {message && <p style={{ marginTop: 10 }}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f5f0f0" },
  card: { width: 350, padding: 30, borderRadius: 10, boxShadow: "0 4px 15px rgba(0,0,0,0.2)", background: "#fff", textAlign: "center" },
  form: { display: "flex", flexDirection: "column" },
  input: { marginBottom: 15, padding: 10, borderRadius: 5, border: "1px solid #ccc", fontSize: 16 },
  button: { padding: 10, borderRadius: 5, border: "none", background: "#ff0000ff", color: "#fff", fontSize: 16, cursor: "pointer" },
};

export default Register;
