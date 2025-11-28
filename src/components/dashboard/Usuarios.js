import { useEffect, useState } from "react";
import api from "../../axiosConfig"; // adapta tu ruta

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [search, setSearch] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    const res = await api.get("/usuarios");
    setUsuarios(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/usuarios", { nombre, email, password });

      setNombre("");
      setEmail("");
      setPassword("");

      fetchUsuarios();
      alert("Usuario creado con éxito");
    } catch (err) {
      console.error(err);
      alert("Error al crear usuario");
    }
  };

  const filtered = usuarios.filter(u =>
    (u.nombre?? "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.card}>

      {/* Barra superior */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          placeholder="Buscar usuario..."
          style={styles.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="off"
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => {
            const value = e.target.value;
            setPassword(value);

            if (value.length < 6) {
              setPasswordError("La contraseña debe tener al menos 6 caracteres");
            } else if (!/\d/.test(value)) {
              setPasswordError("La contraseña debe incluir al menos un número");
              } else if (!/[a-z]/.test(value)) {
      setPasswordError("La contraseña debe incluir al menos una letra minúscula");
            } else {
              setPasswordError("");
            }
          }}
          required
        />
        {passwordError && (
          <div style={{ color: "red", fontSize: "12px", marginTop: "-8px" }}>
            {passwordError}
          </div>
        )}
        <button style={styles.button} disabled={passwordError !== ""}>
          Crear
        </button>
      </form>

      {/* Tabla */}
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={{ ...styles.th, ...styles.thLeft }}>Nombre</th>
            <th style={styles.th}>Email</th>
            <th style={{ ...styles.th, ...styles.thRight }}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((u, i) => (
            <tr
              key={u.id}
              style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}
            >
              <td style={styles.td}>{u.nombre}</td>
              <td style={styles.td}>{u.email}</td>
              <td style={styles.td}>
                <button style={styles.actionBtn}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    height: "97%",
  },

  form: {
    display: "flex",
    gap: "10px",
  },

  input: {
    padding: 8,
    borderRadius: 5,
    border: "1px solid #ccc",
    flex: 1,
  },

  search: {
    padding: 8,
    borderRadius: 5,
    border: "1px solid #aaa",
    width: "250px",
  },

  button: {
    padding: "10px 18px",
    borderRadius: 5,
    background: "#003bbf",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  headerRow: {
    background: "#003bbf",
    color: "#fff",
  },

  th: {
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #002c8f",
  },

  thLeft: {
    borderTopLeftRadius: "8px",
  },

  thRight: {
    borderTopRightRadius: "8px",
  },

  rowEven: {
    background: "#f9f9f9",
    transition: "background 0.2s",
  },

  rowOdd: {
    background: "#fff",
    transition: "background 0.2s",
  },

  td: {
    padding: "10px",
    borderBottom: "1px solid #eee",
  },

  actionBtn: {
    padding: "6px 10px",
    borderRadius: 4,
    border: "none",
    cursor: "pointer",
    background: "#e0e0e0",
  },
};
