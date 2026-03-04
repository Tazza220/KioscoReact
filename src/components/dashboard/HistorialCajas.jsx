import { useEffect, useState } from "react";
import api from "../../axiosConfig";
import "../../styles/HistorialCajas.css";

// Componentes
import CajaList from "./HistorialCajas/CajaList";
import CajaResumen from "./HistorialCajas/CajaResumen";
import CajaTabs from "./HistorialCajas/CajaTabs";
import VentaDetalle from "./HistorialCajas/VentaDetalle";

export default function HistorialCajas() {
  const [cajas, setCajas] = useState([]);
  const [cajaSeleccionada, setCajaSeleccionada] = useState(null);
  const [tab, setTab] = useState("MOVIMIENTOS");
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ==========================
     CARGA INICIAL DE CAJAS
  ========================== */
  useEffect(() => {
    async function cargarCajas() {
      try {
        setLoading(true);
        const { data } = await api.get("/caja");
        setCajas(data);

        if (data.length > 0) {
          seleccionarCaja(data[0]);
        }
      } catch (err) {
        console.error("Error cargando cajas", err);
      } finally {
        setLoading(false);
      }
    }

    cargarCajas();
  }, []);

  /* ==========================
     SELECCIÓN DE CAJA
  ========================== */
  async function seleccionarCaja(caja) {
    try {
      setLoading(true);
      setVentaSeleccionada(null);

      const { data } = await api.get(`/caja/${caja.id}/resumen`);

      setCajaSeleccionada(data);
      setTab("MOVIMIENTOS");

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
      const { data } = await api.get(`/ventas/${venta.id}/detalle`);
      setVentaSeleccionada(data);
    } catch (err) {
      console.error("Error cargando detalle de venta", err);
    } finally {
      setLoading(false);
    }
  }

  async function actualizarFactura(ventaId, factura) {
  try {
    // opcional: validar formato rápido
    const f = (factura || "").trim();
    setLoading(true);

    await api.put(`/ventas/${ventaId}/factura`, { factura: f });

    // refrescar la caja seleccionada para que la tabla muestre el cambio
    if (cajaSeleccionada?.id) {
      const { data } = await api.get(`/caja/${cajaSeleccionada.id}/resumen`);
      setCajaSeleccionada(data);
    }

    // si la venta seleccionada es esa, actualizá también el detalle en pantalla
    if (ventaSeleccionada?.id === ventaId) {
      const { data } = await api.get(`/ventas/${ventaId}/detalle`);
      setVentaSeleccionada(data);
    }
  } catch (err) {
    console.error("Error actualizando factura", err);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="historial-cajas-container">
      
      {/* ============ COLUMNA IZQUIERDA ============ */}
      <aside className="historial-cajas-sidebar">
        <h2>Historial de Cajas</h2>

        {/* LISTA SCROLLEABLE */}
        <div className="historial-cajas-lista">
          <CajaList
            cajas={cajas}
            cajaSeleccionada={cajaSeleccionada}
            onSelect={seleccionarCaja}
          />
        </div>

        {/* RESUMEN FIJO */}
        {cajaSeleccionada && (
          <CajaResumen caja={cajaSeleccionada} />
        )}
      </aside>

      {/* ============ COLUMNA DERECHA ============ */}
      <main className="historial-cajas-content">
        {loading && <p>Cargando...</p>}

        {!loading && cajaSeleccionada && (
          <>
            <CajaTabs
              caja={cajaSeleccionada}
              movimientos={cajaSeleccionada.movimientos}
              ventas={cajaSeleccionada.ventas}
              ventaSeleccionadaId={ventaSeleccionada?.id??0}
              tab={tab}
              setTab={setTab}
              onSelectVenta={seleccionarVenta}
              onFacturaChange={actualizarFactura}
            />

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
