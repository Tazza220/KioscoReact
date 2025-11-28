import { useState, useEffect } from "react";
import api from "../../axiosConfig";

export default function DashboardProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [nombre, setNombre] = useState("");
  const [cuit, setCuit] = useState("");
  const [contacto, setContacto] = useState("");

  // Cargar proveedores
  const fetchProveedores = async () => {
    try {
      const res = await api.get("/proveedores");
      setProveedores(res.data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar los proveedores");
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  // Agregar proveedor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/proveedores", {
        nombre,
        cuit,
        contacto
      });
      alert("Proveedor agregado exitosamente");

      // limpiar formulario
      setNombre("");
      setCuit("");
      setContacto("");

      // refrescar lista
      fetchProveedores();
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al agregar el proveedor");
    }
  };

  return (
    <div style={{
      background: "#fff",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      height: "97%",
    }}>
      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
        <input
          style={styles.input}
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="text"
          placeholder="CUIT"
          value={cuit}
          onChange={(e) => setCuit(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Contacto"
          value={contacto}
          onChange={(e) => setContacto(e.target.value)}
        />
        <button style={styles.button} type="submit">Agregar</button>
      </form>

      {/* Tabla */}
      <div style={{ overflowY: "auto", flex: 1 }}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th>Nombre</th>
              <th>CUIT</th>
              <th>Contacto</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((p, i) => (
              <tr key={p.id} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td>{p.nombre}</td>
                <td>{p.cuit}</td>
                <td>{p.contacto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  input: { padding: 8, borderRadius: 5, border: '1px solid #ccc', flex: 1 },
  button: { padding: 10, borderRadius: 5, border: 'none', background: '#003bbf', color: '#fff', cursor: 'pointer' },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "500px" },
  thead: { 
    textAlign: "left", 
    background: "#003bbf", 
    color: "#fff", 
    fontWeight: "bold", 
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
  },
  rowEven: { background: "#f9f9f9", transition: "background 0.2s" },
  rowOdd: { background: "#fff", transition: "background 0.2s" },
};
