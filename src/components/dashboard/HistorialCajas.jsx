import { useEffect, useState } from "react";

// Componentes
import CajaList from "./CajaList";
import CajaResumen from "./CajaResumen";
import CajaTabs from "./CajaTabs";
import CajaMovimientos from "./CajaMovimientos";
import CajaVentas from "./CajaVentas";
import VentaDetalle from "./VentaDetalle";

export default function HistorialCajas() {
  const [cajas, setCajas] = useState([]);
  const [cajaSeleccionada, setCajaSeleccionada] = useState(null);
  const [tabActiva, setTabActiva] = useState("movimientos");
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ==========================
     CARGA INICIAL DE CAJAS
  ========================== */
  useEffect(() => {
    async function fetchCajas() {
      try {
        setLoading(true);
        const res = await fetch("/api/cajas");
        const data = await res.json();

        setCajas(data);

        // Seleccionar la primera por defecto
        if (data.length > 0) {
          seleccionarCaja(data[0]);
        }
      } catch (err) {
        console.error("Error cargando cajas", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCajas();
  }, []);

  /* ==========================
     SELECCIÓN DE CAJA
  ========================== */
  async function seleccionarCaja(caja) {
    try {
      setLoading(true);
      setVentaSeleccionada(null);

      const res = await fetch(`/api/cajas/${caja.id}`);
      const detalle = await res.json();

      setCajaSeleccionada(detalle);
      setTabActiva("movimientos");
    } catch (err) {
      console.error("Error cargando detalle de caja", err);
    } finally {
      setLoading(false);
    }
  }

  /* ==========================
     SELECCIÓN DE VENTA
  ========================== */
  async function seleccionarVenta(venta) {
    try {
      setLoading(true);
      const res = await fetch(`/api/ventas/${venta.id}`);
      const detalle = await res.json();

      setVentaSeleccionada(detalle);
    } catch (err) {
      console.error("Error cargando detalle de venta", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="historial-cajas-container">
      {/* COLUMNA IZQUIERDA */}
      <aside className="historial-cajas-sidebar">
        <h2>Historial de Cajas</h2>

        <CajaList
          cajas={cajas}
          cajaSeleccionada={cajaSeleccionada}
          onSelect={seleccionarCaja}
        />

        {cajaSeleccionada && (
          <CajaResumen caja={cajaSeleccionada} />
        )}
      </aside>

      {/* COLUMNA DERECHA */}
      <main className="historial-cajas-content">
        {loading && <p>Cargando...</p>}

        {!loading && cajaSeleccionada && (
          <>
            <CajaTabs
              tabActiva={tabActiva}
              onChange={setTabActiva}
            />

            {tabActiva === "movimientos" && (
              <CajaMovimientos
                movimientos={cajaSeleccionada.movimientos}
              />
            )}

            {tabActiva === "ventas" && (
              <CajaVentas
                ventas={cajaSeleccionada.ventas}
                ventaSeleccionada={ventaSeleccionada}
                onSelectVenta={seleccionarVenta}
              />
            )}

            {ventaSeleccionada && (
              <VentaDetalle venta={ventaSeleccionada} />
            )}
          </>
        )}

        {!loading && !cajaSeleccionada && (
          <p>Seleccione una caja para ver el detalle</p>
        )}
      </main>
    </div>
  );
}
