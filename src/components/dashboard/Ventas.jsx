import React, { useState, useEffect, useContext, useRef  } from 'react';
import { AuthContext } from "../../AuthContext";
import api from "../../axiosConfig";
import { MdPrint } from "react-icons/md";
import { FaDeleteLeft } from "react-icons/fa6";
import "./../../styles.css";

export default function Ventas() {
  const [codigoBarra, setCodigo] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [entrega, setEntrega] = useState(0);
  const [mostrarModalVariable, setMostrarModalVariable] = useState(false);
const [productoVariableSeleccionado, setProductoVariableSeleccionado] = useState(null);
const [cantidadVariable, setCantidadVariable] = useState(1);
const [precioVariable, setPrecioVariable] = useState("");
  const [comentario, setComentario] = useState('');
  const [resultados, setResultados] = useState([]);
  const [formasPago, setFormasPago] = useState([]);
  const [formaPago, setFormaPago] = useState(1); // por defecto efectivo
  const [historial, setHistorial] = useState([]);
  const { userId } = useContext(AuthContext);
  const precioInputRef = useRef(null);
  const [cajaEstado, setCajaEstado] = useState(null);
const [cargandoCaja, setCargandoCaja] = useState(true);


useEffect(() => {
  const cargarEstadoCaja = async () => {
    try {
      const r = await api.get("/caja/estado");
      setCajaEstado(r.data);
    } catch (err) {
      console.error("Error obteniendo estado de caja", err);
    } finally {
      setCargandoCaja(false);
    }
  };

  cargarEstadoCaja();
}, []);


const eliminarVenta = async (id) => {
  if (!window.confirm("¿Eliminar esta venta?")) return;

  try {
    await api.delete(`/ventas/${id}`);

    // quitar la fila del historial sin recargar
    setHistorial(prev => prev.filter(v => v.id !== id));
  } catch (err) {
    console.error(err);
    alert("Error al eliminar la venta");
  }
};


// Función para abrir el modal desde tu agregarProducto
const abrirModalVariable = (producto) => {
  setProductoVariableSeleccionado(producto);
  setCantidadVariable(1);        // valor inicial de cantidad
  setPrecioVariable(""); // valor inicial del precio vigente
  setMostrarModalVariable(true);
};

// Función para confirmar y agregar al carrito
const confirmarVariable = () => {
  if (!cantidadVariable || !precioVariable) {
    alert("Ingrese cantidad y precio");
    return;
  }

  setCarrito(prev => [
    ...prev,
    {
      ...productoVariableSeleccionado,
      cantidad: parseFloat(cantidadVariable),
      precio: parseFloat(precioVariable),
      _lineId: crypto.randomUUID(), // 👈 clave única de línea
      esVariable: true
    }
  ]);

  setMostrarModalVariable(false);
  setProductoVariableSeleccionado(null);
  setCantidadVariable(1);
  setPrecioVariable("");
};


useEffect(() => {
  if (mostrarModalVariable) {
    // pequeño delay para asegurar render
    setTimeout(() => {
      precioInputRef.current?.focus();
      precioInputRef.current?.select(); // opcional: selecciona el valor
    }, 0);
  }
}, [mostrarModalVariable]);

const cargarHistorial = async () => {
  const r = await api.get("/Ventas/Historial");
  setHistorial(r.data);
};

const actualizarComentario = (id, valor) => {
  setHistorial(prev =>
    prev.map(v => v.id === id ? { ...v, comentario: valor } : v)
  );
};

const guardarComentario = async (id) => {
  const venta = historial.find(v => v.id === id);
  await api.put(`/ventas/${id}/comentario`, { comentario: venta.comentario??"" });
};

const imprimirTicket = (id) => {
  window.open(`/api/ventas/${id}/ticket`, "_blank");
};
  // 🔍 Buscar productos por nombre o código mientras se escribe
  const buscarProducto = async (texto) => {
    if (!texto.trim()) {
      setResultados([]);
      return;
    }

    try {
      const resp = await api.get(`/productos/buscar?query=${encodeURIComponent(texto)}`);
      setResultados(resp.data);
    } catch (err) {
      console.error(err);
      setResultados([]);
    }
  };

 const agregarProducto = (p) => {
  if (!p || !p.precio) {
    alert("El producto no tiene precio vigente");
    return;
  }

  // Si el producto es variable
  if (p.precioVariable) {
  abrirModalVariable(p);
  return;
}

  

  // Producto normal: cantidad +1
  setCarrito(prev => {
    const existe = prev.find(x => x.id === p.id);
    if (existe) {
      return prev.map(x =>
        x.id === p.id ? { ...x, cantidad: x.cantidad + 1 } : x
      );
    }
    return [...prev, { ...p, cantidad: 1 }];
  });

  setCodigo('');
  setResultados([]);
};

  // Total y cambio
  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const cambio = entrega > total ? entrega - total : 0;

  // ⌨ Submit: intenta cargar producto exacto por código
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!codigoBarra.trim()) return;

  try {
    const resp = await api.get(`/productos/codigo/${codigoBarra}`);
    if (resp.data) {
      agregarProducto(resp.data);
      return;
    }
  } catch (err) {
    if (err.response && err.response.status === 404) {
      alert("Código inexistente");
      setCodigo('');
      return;
    }
    console.error(err);
  }

  // Si no existe por código → mostrar sugerencias
  buscarProducto(codigoBarra);
};


  // Cargar enum del backend
  useEffect(() => {
    const cargarFormasPago = async () => {
      try {
        const response = await api.get("/ventas/formas-pago");
        setFormasPago(response.data);
      } catch (error) {
        console.error("Error cargando formas de pago:", error);
      }
    };
    cargarFormasPago();
    cargarHistorial();
    setEntrega(total);
  }, [total]);


  // 🧾 Finalizar venta
  const handleFinalizar = async () => {
    if (carrito.length === 0) return alert("El carrito está vacío");
    if (entrega < total) return alert("Entrega insuficiente");

    try {
      console.log("ID del usuario:", userId);
      await api.post("/Ventas", {
        formaPago,
        comentario,
        VendedorId: userId,
        items: carrito.map(c => ({
          productoId: c.id,
          cantidad: c.cantidad,
          precioUnitario: c.esVariable ? c.precio : null
        }))
      });

      alert(`Venta registrada. Total: $${total}, Cambio: $${cambio}`);

      setCarrito([]);
      setEntrega(0);
      setCodigo('');
      setComentario('');
      setResultados([]);
      cargarHistorial();

    } catch (err) {
      console.error(err);
      alert("Error al registrar la venta");
    }
  };
  const colgroup = (
  <colgroup>
    <col style={{ width: "60%" }} />
    <col style={{ width: "10%" }} />
    <col style={{ width: "15%" }} />
    <col style={{ width: "15%" }} />
  </colgroup>

  
);

const colgroupH = (
  <colgroup>
    <col style={{ width: "25%" }} />
    <col style={{ width: "15%" }} />
    <col style={{ width: "20%" }} />
    <col style={{ width: "32%" }} />
    <col style={{ width: "8%" }} />
  </colgroup>
);

const eliminarProducto = (id, lineId) => {
  setCarrito(prev =>
    prev.filter(p =>
      p.esVariable ? p._lineId !== lineId : p.id !== id
    )
  );
};

const cambiarCantidad = (id, nuevaCantidad) => {
  setCarrito(prev =>
    prev.map(p =>
      p.id === id
        ? { ...p, cantidad: Number(nuevaCantidad) }
        : p
    )
  );
};

if (cargandoCaja) {
  return <div>Cargando estado de caja...</div>;
}

if (!cajaEstado?.abierta) {
  return (
    <div style={{ padding: 40 }}>
      <h2>🚫 Caja cerrada</h2>
      <p>Debe abrir una caja para poder registrar ventas.</p>
    </div>
  );
}

  return (


    
    <div style={{ display: 'flex', height: '96vh', gap: 20, padding: 8 }}>

      {/* CARRITO */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: '#fff', borderRadius: 10,
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)', padding: 20,
      }}>
        <h3 style={{margin:0}}>Carrito</h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop:10}}>
          {colgroup}
            <thead>
              <tr>
                <th style={{...styles.th}}>Producto</th>
                <th style={styles.th}>Cant</th>
                <th style={styles.th}>Precio</th>
                <th style={styles.th}>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            </table>
        {/* CONTENEDOR SCROLLEABLE SOLO PARA LA TABLA */}
  <div style={{
    flex: 1,
    overflowY: "auto",
    marginBottom: 20
  }}>

        {carrito.length === 0 ? <p>Carrito vacío</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse'}}>
            {colgroup}
            <tbody>
              {carrito.map(p => (
                <tr key={p._lineId ?? p.id}>
                  <td style={styles.td}>{p.nombre}</td>
                  <td style={styles.td}><input
  style={styles.inputCantidad}
  type="number"
  value={p.cantidad}
  min="1"
  step="1"
  onChange={e => cambiarCantidad(p.id, e.target.value)}
/></td>
                  <td style={styles.td}>${p.precio}</td>
                  <td style={styles.td}>${p.precio * p.cantidad}</td>
                  <td><button
    style={styles.btnDelete}
    onClick={() => eliminarProducto(p.id, p._lineId)}
  >
    <FaDeleteLeft />
  </button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
  </div>

        <div style={{ marginTop: 'auto' }}>
          <p>Total: <b>${total}</b></p>

          <input
            type="number"
            placeholder="Entrega"
            value={entrega}
            onChange={e => setEntrega(Number(e.target.value))}
            style={{ ...styles.input, width: '30%' }}
          />
          <select
            value={formaPago}
            onChange={(e) => setFormaPago(Number(e.target.value))}
            style={{
              padding: 10,
              marginTop: 10,
              marginBottom: 10,
              width: "30%",
              borderRadius: 5,
              border: "1px solid #ccc"
            }}
          >
            {formasPago.map(fp => (
              <option key={fp.id} value={fp.id}>
                {fp.nombre}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Comentario"
            value={comentario}
            onChange={e => setComentario(e.target.value)}
            style={{ ...styles.input, width: '30%' }}
          />

          <div><div  style={{width:'30%', display:'inline-block'}}>Cambio: <b>${cambio}</b></div>
          <button onClick={handleFinalizar} style={{ ...styles.button, width: '70%' }}>
            Finalizar Venta
          </button></div>
        </div>
      </div>

      {/* ESCANEAR + AUTOCOMPLETAR */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>

<div style={{
  flex: 2,
  background: '#fff',
  borderRadius: 10,
  padding: 20,
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  height:"65%"
}}>

  <h3 style={{margin:0}}>Historial de Ventas</h3>

  {/* LISTA SCROLLEABLE */}
  <div style={{ marginTop: 10, maxHeight: "80vh" }}>

    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      {colgroupH}
      <thead>
        <tr>
          <th style={{...styles.thSmall, width:100}}>Fecha y Hora</th>
          <th style={styles.thSmall}>Total</th>
          <th style={styles.thSmall}>Pago</th>
          <th style={styles.thSmall}>Comentario</th>
          <th style={styles.thSmall}></th>
        </tr>
      </thead>
      </table>
      <div style={{
    overflowY: "auto",
    marginBottom: 20,
    height:"70%"
  }}>
<table>
  {colgroupH}
      <tbody>
        {historial.map(v => (
          <tr key={v.id}>
            <td style={styles.tdSmall}>
              {new Date(v.fecha).toLocaleString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,  
              }).replace(",", "")}
            </td>

            <td style={styles.tdSmall}>
              ${v.total}
            </td>

            <td style={styles.tdSmall}>
              {formasPago.find(fp => fp.id === Number(v.formaPago))?.nombre ?? "N/A"}
            </td>

            <td style={styles.tdSmall}>
              <input
                type="text"
                value={v.comentario || ""}
                onChange={(e) => actualizarComentario(v.id, e.target.value)}
                onBlur={() => guardarComentario(v.id)}
                style={{
                  width: "95%",
                  padding: 5,
                  border: "1px solid #ccc",
                  borderRadius: 5
                }}
              />
            </td>

            <td style={styles.tdSmall}>
              <button
                style={{
                  padding: "4px 4px",
                }}
                onClick={() => eliminarVenta(v.id)}
              >
                <FaDeleteLeft size={20} style={{marginTop:2}}/>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>

    {historial.length === 0 && (
      <p style={{ marginTop: 20, opacity: 0.6 }}>No hay ventas registradas.</p>
    )}

  </div>
</div>


        <div style={{
          flex:2,
          background: '#fff', borderRadius: 10,
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)', padding: 20
        }}>
          <h3 style={{margin:0}}>Escanear producto</h3>

          <form onSubmit={handleSubmit}>
            <div style={{ position: "relative",marginTop:10 }}>
              <input
                type="text"
                placeholder="Código o nombre..."
                value={codigoBarra}
                onChange={e => {
                  const v = e.target.value;
                  setCodigo(v);
                  buscarProducto(v);
                }}
                style={styles.input}
                autoComplete="off"
                autoFocus
              />

              {/* AUTOCOMPLETAR */}
              {resultados.length > 0 && codigoBarra.length > 0 && (
                <div style={dropdown}>
                  {resultados.map(r => (
                    <div
                      key={r.id}
                      onClick={() => agregarProducto(r)}
                      onMouseDown={e => e.preventDefault()}
                      style={option}
                    >
                      <b>{r.nombre}</b> – ${r.precio}
                      <br />
                      <small style={{ color: "#777" }}>Código: {r.codigoBarra}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" style={styles.button}>
              Agregar
            </button>
          </form>
        </div>

        
      </div>
      {mostrarModalVariable && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 10,
        width: 300,
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        gap: 10
      }}
    >
      <h3>{productoVariableSeleccionado?.nombre}</h3>

      <label>
        Cantidad:
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={cantidadVariable}
          onChange={e => setCantidadVariable(e.target.value)}
          style={{ width: "100%", padding: 5, marginTop: 5 }}
        />
      </label>

      <label>
        Precio unitario:
        <input
          type="number"
          min="0"
          step="0.01"
          value={precioVariable}
          onChange={e => setPrecioVariable(e.target.value)}
          ref={precioInputRef}
          style={{ width: "100%", padding: 5, marginTop: 5 }}
          onKeyDown={e => {
            if (e.key === "Enter") confirmarVariable();
          }}
        />
      </label>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
        <button
          onClick={() => {
            setMostrarModalVariable(false);
            setCantidadVariable(1);
            setPrecioVariable("");
          }}
          style={{ padding: 10, borderRadius: 5, border: "none", background: "#522222ff", cursor: "pointer" }}
        >
          Cancelar
        </button>

        <button
          onClick={confirmarVariable}
          style={{ padding: 10, borderRadius: 5, border: "none", background: "#28a745", color: "#fff", cursor: "pointer" }}
        >
          Agregar
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

const dropdown = {
  position: "absolute",
  bottom: "100%",    // 👉 se despliega hacia arriba
  left: 0,
  width: "90%",
  background: "#fff",
  border: "1px solid #ccc",
  borderRadius: 5,
  maxHeight: 250,
  overflowY: "auto",
  zIndex: 50,
  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)"
};

const option = {
  padding: "8px 10px",
  cursor: "pointer",
  borderBottom: "1px solid #eee"
};

const styles = {
  btnDelete:{color:"#fff",
    padding:"5px 5px 2px 5px",
  },
  inputCantidad:{
    width:"100%"
  },
  input: {
    padding: 10,
    marginBottom: 10,
    width: '90%',
    borderRadius: 5,
    border: '1px solid #ccc'
  },
  th: { borderBottom: "1px solid #ccc", textAlign: "left" },
  td: { padding: 5 },
  thSmall: {
    textAlign: "left",
    padding: 2,
    background: "#fafafa",
    borderBottom: "2px solid #ddd"
  },
  tdSmall: {
    padding: "2px 2px",
    borderBottom: "1px solid #eee",
    verticalAlign: "middle",
    fontSize:"14px"
  }
};
