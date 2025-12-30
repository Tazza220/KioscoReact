import React, { useEffect, useState, useContext } from "react";
import api from "../../axiosConfig";
import { AuthContext } from "../../AuthContext";
import { FaPlusCircle, FaMinusCircle, FaLock } from "react-icons/fa";
import "../../styles.css";
import "../../styles/Caja.css"; // 👈 último import



export default function Caja({ recargarCajaEstado }) {
  const { userId } = useContext(AuthContext);

  const [caja, setCaja] = useState(null);
  const [tipo, setTipo] = useState("INGRESO");
  const [monto, setMonto] = useState("");
  const [concepto, setConcepto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [formaPago, setFormaPago] = useState("EFECTIVO");

  const cargarCaja = async () => {
  try {
    const r = await api.get("/caja/actual");
    setCaja(r.data);
  } catch (e) {
    if (e.response && e.response.status === 404) {
      setCaja(false); // 🚫 no hay caja abierta
    } else {
      alert("Error cargando caja");
    }
  }
};

const abrirCaja = async () => {
  try {
    await api.post("/caja/abrir", { usuarioId: userId });
    await cargarCaja();
    recargarCajaEstado();
  } catch {
    alert("Error al abrir caja");
  }
};

  useEffect(() => {
    cargarCaja();
  }, []);

  const registrarMovimiento = async () => {
    if (!monto || !concepto) {
      alert("Complete monto y concepto");
      return;
    }

    setCargando(true);
    try {
      await api.post("/caja/movimiento", {
        tipo,
        formaPago,
        monto: Number(monto),
        concepto,
        usuarioId: userId
      });

      setMonto("");
      setConcepto("");
      cargarCaja();
    } catch (e) {
    if (e.response && e.response.status === 400) {
      // 📢 mensaje del backend
      alert(e.response.data);
    } else {
      alert("Error registrando movimiento");
    }
  }
    setCargando(false);
  };

  const cerrarCaja = async () => {
    if (!window.confirm("¿Desea cerrar la caja del día?")) return;

    try {
      await api.post("/caja/cerrar", { usuarioId: userId });
      alert("Caja cerrada correctamente");
      await cargarCaja();
      recargarCajaEstado();
    } catch {
      alert("Error al cerrar caja");
    }
  };

  if (caja === null) {
  return <p>Cargando caja...</p>;
}

if (caja === false) {
  return (
    <div className="contenedor">
      <h2>📦 Caja</h2>

      <div className="caja-cerrada">
        <p>No hay una caja abierta actualmente.</p>

        <button onClick={abrirCaja} className="btn-abrir">
          <FaLock /> Abrir caja
        </button>
      </div>
    </div>
  );
}

  return (
  <div className="contenedor">
    <div className="caja-layout">

      {/* ================= IZQUIERDA ================= */}
      <div className="caja-left">

        {/* CAJA DEL DÍA */}
        <h2>📦 Caja del día</h2>

        <table className="tabla">
          <thead>
            <tr>
              <th>Forma de pago</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {caja.ventasPorFormaPago.map(v => (
              <tr key={v.formaPago}>
                <td>{v.formaPago}</td>
                <td>${v.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h4>Total ventas: ${caja.totalVentas.toFixed(2)}</h4>

        <hr />

        {/* RESUMEN POR FORMA DE PAGO */}
        <h3>Resumen por forma de pago</h3>

        <table className="tabla">
          <thead>
            <tr>
              <th>Forma de pago</th>
              <th>Ventas</th>
              <th>Ingresos</th>
              <th>Egresos</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            {caja.resumenPorFormaPago.map(r => (
              <tr key={r.formaPago}>
                <td>{r.formaPago}</td>
                <td>${r.ventas.toFixed(2)}</td>
                <td className="verde">${r.ingresos.toFixed(2)}</td>
                <td className="rojo">${r.egresos.toFixed(2)}</td>
                <td>
                  <strong>${r.saldo.toFixed(2)}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr />

        {/* SALDO FINAL + CIERRE */}
        <div className="resumen-caja">
          <p>Ingresos manuales: ${caja.totalIngresosManuales.toFixed(2)}</p>
          <p>Egresos manuales: ${caja.totalEgresosManuales.toFixed(2)}</p>
          <h2>Saldo en caja: ${caja.saldoCaja.toFixed(2)}</h2>
        </div>

        <button className="btn-cerrar" onClick={cerrarCaja}>
          <FaLock /> Cerrar caja
        </button>
      </div>

      {/* ================= DERECHA ================= */}
      <div className="caja-right">

        <h3>Movimiento de caja</h3>

        <div className="fila fila-movimiento">
          <select value={tipo} onChange={e => setTipo(e.target.value)}>
            <option value="INGRESO">Ingreso</option>
            <option value="EGRESO">Egreso</option>
          </select>

          <select value={formaPago} onChange={e => setFormaPago(e.target.value)}>
            <option value="EFECTIVO">Efectivo</option>
            <option value="DEBITO">Debito</option>
            <option value="CREDITO">Credito</option>
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="OTRO">Otro</option>
          </select>

          <input
            type="number"
            placeholder="Monto"
            value={monto}
            onChange={e => setMonto(e.target.value)}
          />

          <input
            type="text"
            placeholder="Concepto"
            value={concepto}
            onChange={e => setConcepto(e.target.value)}
          />

          <button onClick={registrarMovimiento} disabled={cargando}>
            {tipo === "INGRESO" ? <FaPlusCircle /> : <FaMinusCircle />}
            Registrar
          </button>
        </div>
<div className="movimientos-wrapper">
        {/* MOVIMIENTOS */}
        <table className="tabla">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Forma pago</th>
              <th>Monto</th>
              <th>Concepto</th>
              <th>Hora</th>
            </tr>
          </thead>
          <tbody>
            {caja.movimientos.map(m => (
              <tr key={m.id}>
                <td>{m.tipo}</td>
                <td>{m.formaPago}</td>
                <td className={m.tipo === "EGRESO" ? "rojo" : "verde"}>
                  ${m.monto.toFixed(2)}
                </td>
                <td>{m.concepto}</td>
                <td>{new Date(m.fecha).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

      </div>
    </div>
  </div>
);

}
