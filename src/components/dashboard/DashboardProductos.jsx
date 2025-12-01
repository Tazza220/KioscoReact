import { useEffect, useState } from "react";
import api from "../../axiosConfig"; // ajusta la ruta

export default function DashboardProductos({ alertaPrecioBajo = true }) {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [precio, setPrecio] = useState("");
  const [busqueda, setBusqueda] = useState("");
const [precioVariable, setPrecioVariable] = useState(false);

  // Cargar productos con precio vigente
  const fetchProductos = async () => {
    try {
      const res = await api.get("/productos");
      const productosConPrecio = await Promise.all(
        res.data.map(async (p) => {
          const precioRes = await api.get(`/precios/actual/${p.id}`);
          return { ...p, precioActual: precioRes.data.precio };
        })
      );
      setProductos(productosConPrecio);
    } catch (err) {
      console.error(err);
      alert("Error al cargar los productos");
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Filtrar productos según búsqueda
  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigoBarra.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Manejo de agregar producto
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Intentar obtener producto existente
      let productoExistente = null;
      try {
        const res = await api.get(`/productos/codigo/${codigo}`);
        productoExistente = res.data;
      } catch (err) {
        if (err.response && err.response.status === 404) {
          productoExistente = null; // No existe, seguimos
        } else {
          throw err; // Otro error
        }
      }

      if (productoExistente) {
        // obtener precio vigente
        const precioRes = await api.get(`/precios/actual/${productoExistente.id}`);
        const precioActual = precioRes.data.precio;

        if (alertaPrecioBajo && parseFloat(precio) < parseFloat(precioActual)) {
          if (!window.confirm(
            `El nuevo precio (${precio}) es menor que el actual (${precioActual}). ¿Desea continuar?`
          )) return;
        }

        // Crear nuevo precio histórico
        await api.post("/precios/remarcar", null, {
          params: {
            productoId: productoExistente.id,
            nuevoPrecio: precio
          }
        });
        alert("Precio histórico agregado exitosamente");

      } else {
        // Crear producto
        const productoNuevo = await api.post("/productos", {
          nombre,
          codigoBarra: codigo,
          precioVariable
        });

        // Crear primer precio
        await api.post("/precios/remarcar", null, {
          params: {
            productoId: productoNuevo.data.id,
            nuevoPrecio: precio
          }
        });
        alert("Producto creado con precio inicial");
      }

      // limpiar formulario
      setNombre("");
      setCodigo("");
      setPrecio("");

      // refrescar lista
      fetchProductos();

    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al agregar el producto");
    }
  };

  // Manejo de remarcar precio desde la tabla
  const handleRemarcar = async (id) => {
    const nuevoPrecio = prompt("Ingrese el nuevo precio:");
    if (!nuevoPrecio) return;

    try {
      const precioRes = await api.get(`/precios/actual/${id}`);
      const precioActual = precioRes.data.precio;

      if (alertaPrecioBajo && parseFloat(nuevoPrecio) < parseFloat(precioActual)) {
        if (!window.confirm(
          `El nuevo precio (${nuevoPrecio}) es menor que el actual (${precioActual}). ¿Desea continuar?`
        )) return;
      }

      await api.post("/precios/remarcar", null, {
        params: { productoId: id, nuevoPrecio }
      });

      alert("Precio actualizado");
      fetchProductos();

    } catch (err) {
      console.error(err);
      alert("Error al remarcar el precio");
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
        placeholder="Código de barras"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        required
      />
      <input
        style={styles.input}
        type="number"
        placeholder="Precio inicial"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        required
        step="0.01"
      />
      {/* ✅ Checkbox precio variable */}
  <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
    <input
      type="checkbox"
      checked={precioVariable}
      onChange={(e) => setPrecioVariable(e.target.checked)}
    />
    Precio variable
  </label>
      <button style={styles.button} type="submit">Agregar</button>
    </form>
    <div>{/* Buscador */}
      <input
        style={{ ...styles.input, marginBottom: 10, height:"20px" }}
        type="text"
        placeholder="Buscar por nombre o código..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      /></div>
    


    {/* Tabla */}
    <div style={{ overflowY: "auto", flex: 1 }}>
      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={{ ...styles.th, ... styles.thFirst}}>Nombre</th>
            <th style={styles.th}>Código</th>
            <th style={styles.th}>Precio Actual</th>
            <th style={{ ...styles.th, ...styles.thLast}}>Acciones</th>
          </tr>
        </thead>
        <tbody>
            {productosFiltrados.map((p, i) => (
                <tr
                key={p.id}
                style={{
                    ... (i % 2 === 0 ? styles.rowEven : styles.rowOdd),
                    cursor: "pointer"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#e6f0ff"}
                onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? "#f9f9f9" : "#fff"}
                >
                <td style={{padding:"6px 12px"}}>{p.nombre}</td>
                <td style={{padding:"6px 12px"}}>{p.codigoBarra}</td>
                <td style={{padding:"6px 12px"}}>{p.precioActual.toFixed(2)}</td>
                <td>
                    <button style={styles.buttonSmall} onClick={() => handleRemarcar(p.id)}>Remarcar</button>
                </td>
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
  button: { padding: 10, borderRadius: 5, border: 'none', background: '#ff0000ff', color: '#fff', cursor: 'pointer' },
  buttonSmall: { padding: "6px 10px", borderRadius: 5, border: 'none', background: '#ff0000ff', color: '#fff', cursor: 'pointer' },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "600px" },
  thead: { 
    "text-align": "left", 
    top: 0, 
    background: "#502c2cff", 
    color: "#fff", 
    fontWeight: "bold", 
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)" 
  },
  th: {
    padding: "12px 16px", // más espacio entre texto y borde
    textAlign: "left",
  },
  thFirst: {
    borderTopLeftRadius: "8px",
    borderBottomLeftRadius:"8px",
  },
  thLast: {
    borderTopRightRadius: "8px",
    borderBottomRightRadius: "8px",
  },
  rowEven: { background: "#f9f9f9", transition: "background 0.2s" },
  rowOdd: { background: "#fff", transition: "background 0.2s" },
};

