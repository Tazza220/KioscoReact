import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../AuthContext";
import api from "../../axiosConfig";
import "./../../styles.css";

export default function Compras() {
  const [codigoBarra, setCodigo] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [comentario, setComentario] = useState("");
  const [resultados, setResultados] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [proveedorId, setProveedorId] = useState(null);
  const { userId } = useContext(AuthContext);

  const [mostrarModalVariable, setMostrarModalVariable] = useState(false);
  const [productoVariableSeleccionado, setProductoVariableSeleccionado] = useState(null);
  const [cantidadVariable, setCantidadVariable] = useState("");
  const [precioVariableCompra, setPrecioVariableCompra] = useState("");

  // Abrir modal para productos sin precio fijo
  const abrirModalVariable = (producto) => {
    setProductoVariableSeleccionado(producto);
    setCantidadVariable(1);
    setPrecioVariableCompra(""); // el precio de compra siempre es ingresado
    setMostrarModalVariable(true);
  };

  // Confirmar producto variable
  const confirmarVariable = () => {
    if (!cantidadVariable || !precioVariableCompra)
      return alert("Ingrese cantidad y precio de compra");

    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === productoVariableSeleccionado.id);
      if (existe) {
        return prev.map((p) =>
          p.id === productoVariableSeleccionado.id
            ? {
                ...p,
                cantidad: p.cantidad + parseFloat(cantidadVariable),
                precioCompra: parseFloat(precioVariableCompra),
              }
            : p
        );
      }

      return [
        ...prev,
        {
          ...productoVariableSeleccionado,
          cantidad: parseFloat(cantidadVariable),
          precioCompra: parseFloat(precioVariableCompra),
        },
      ];
    });

    setMostrarModalVariable(false);
    setProductoVariableSeleccionado(null);
    setCantidadVariable("");
    setPrecioVariableCompra("");
  };

  const buscarProducto = async (texto) => {
    if (!texto.trim()) return setResultados([]);

    try {
      const resp = await api.get(`/productos/buscar?query=${encodeURIComponent(texto)}`);
      setResultados(resp.data);
    } catch {
      setResultados([]);
    }
  };

  const agregarProducto = (p) => {
    if (p.precioVariable) {
      abrirModalVariable(p);
      return;
    }

    // precio de compra siempre manual
    abrirModalVariable(p);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!codigoBarra.trim()) return;

    try {
      const resp = await api.get(`/productos/codigo/${codigoBarra}`);
      if (resp.data) {
        agregarProducto(resp.data);
        return;
      }
    } catch {
      // buscar sugerencias si no existe
    }

    buscarProducto(codigoBarra);
  };

  // Cargar proveedores
  useEffect(() => {
    const cargarProveedores = async () => {
      const r = await api.get("/proveedores");
      setProveedores(r.data);
      if (r.data.length > 0) setProveedorId(r.data[0].id);
    };
    cargarProveedores();
  }, []);

  const totalCompra = carrito.reduce(
    (acc, p) => acc + p.precioCompra * p.cantidad,
    0
  );

  const registrarCompra = async () => {
    if (!proveedorId) return alert("Seleccione proveedor");
    if (carrito.length === 0) return alert("El carrito está vacío");

    try {
      await api.post("/Compras", {
        proveedorId,
        comentario,
        total: totalCompra,
        UsuarioId: userId,
        items: carrito.map((c) => ({
          productoId: c.id,
          cantidad: c.cantidad,
          precioCompra: c.precioCompra,
        })),
      });

      alert("Compra registrada correctamente");

      setCarrito([]);
      setComentario("");
      setCodigo("");
      setResultados([]);

    } catch (err) {
      console.error(err);
      alert("Error al registrar la compra");
    }
  };

  const colgroup = (
    <colgroup>
      <col style={{ width: "50%" }} />
      <col style={{ width: "15%" }} />
      <col style={{ width: "20%" }} />
      <col style={{ width: "15%" }} />
    </colgroup>
  );

  return (
    <div style={{ display: "flex", height: "95vh", gap: 20, padding: 8 }}>
      {/* CARRITO */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          borderRadius: 10,
          padding: 20,
        }}
      >
        <h3>Carrito de Compra</h3>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          {colgroup}
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cant</th>
              <th>Precio compra</th>
              <th>Subtotal</th>
            </tr>
          </thead>
        </table>

        <div style={{ flex: 1, overflowY: "auto", marginTop: 10 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            {colgroup}
            <tbody>
              {carrito.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.cantidad}</td>
                  <td>${p.precioCompra}</td>
                  <td>${p.precioCompra * p.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>Total: <b>${totalCompra}</b></p>

        <select
          value={proveedorId || ""}
          onChange={(e) => setProveedorId(Number(e.target.value))}
          style={{ padding: 10, width: "60%", marginBottom: 10 }}
        >
          {proveedores.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          style={{ padding: 10, marginBottom: 10, width: "60%" }}
        />

        <button
          onClick={registrarCompra}
          style={{ padding: 15, width: "100%", background: "#28a745", color: "#fff", border: 0 }}
        >
          Registrar Compra
        </button>
      </div>

      {/* BUSCAR / AGREGAR */}
      <div style={{ flex: 1, background: "#fff", borderRadius: 10, padding: 20 }}>
        <h3>Agregar Producto</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Código o nombre..."
            value={codigoBarra}
            onChange={(e) => {
              const v = e.target.value;
              setCodigo(v);
              buscarProducto(v);
            }}
            style={{ padding: 10, width: "90%", marginBottom: 10 }}
          />

          {resultados.length > 0 && (
            <div style={{
              position: "absolute",
              background: "#fff",
              border: "1px solid #ccc",
              width: "40%",
              maxHeight: 200,
              overflowY: "auto",
              zIndex: 10
            }}>
              {resultados.map((r) => (
                <div
                  key={r.id}
                  onClick={() => agregarProducto(r)}
                  style={{ padding: 10, cursor: "pointer", borderBottom: "1px solid #eee" }}
                >
                  {r.nombre} <br />
                  <small>Código: {r.codigoBarra}</small>
                </div>
              ))}
            </div>
          )}

          <button type="submit" style={{ padding: 10, width: "90%" }}>
            Agregar
          </button>
        </form>
      </div>

      {/* MODAL VARIABLE */}
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
          }}
        >
          <div style={{ background: "#fff", padding: 20, width: 300, borderRadius: 10 }}>
            <h3>{productoVariableSeleccionado?.nombre}</h3>

            <label>Cantidad:
              <input
                type="number"
                value={cantidadVariable}
                onChange={(e) => setCantidadVariable(e.target.value)}
                style={{ width: "100%", marginTop: 5 }}
              />
            </label>

            <label>Precio compra:
              <input
                type="number"
                value={precioVariableCompra}
                onChange={(e) => setPrecioVariableCompra(e.target.value)}
                style={{ width: "100%", marginTop: 5 }}
              />
            </label>

            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              <button
                onClick={() => setMostrarModalVariable(false)}
                style={{ flex: 1, padding: 10 }}
              >
                Cancelar
              </button>

              <button
                onClick={confirmarVariable}
                style={{ flex: 1, padding: 10, background: "#28a745", color: "#fff", border: 0 }}
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
