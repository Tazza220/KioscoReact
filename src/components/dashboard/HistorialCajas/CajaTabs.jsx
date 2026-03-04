export default function CajaTabs({
  caja,
  movimientos = [],
  ventas = [],
  tab,
  setTab,
  ventaSeleccionadaId=0,
  onSelectVenta,
  onFacturaChange
}) {
  if (!caja) {
    return (
      <div style={styles.empty}>
        Seleccione una caja para ver información
      </div>
    );
  }

  return (
    <div style={styles.card}>
      {/* ================= TABS ================= */}
      <div style={styles.tabs}>
        <TabButton
          active={tab === "MOVIMIENTOS"}
          onClick={() => setTab("MOVIMIENTOS")}
        >
          Movimientos
        </TabButton>

        <TabButton
          active={tab === "VENTAS"}
          onClick={() => setTab("VENTAS")}
        >
          Ventas
        </TabButton>
      </div>

      {/* ================= CONTENT ================= */}
      <div style={styles.content}>
        {tab === "MOVIMIENTOS" && (
          <Movimientos movimientos={movimientos} />
        )}

        {tab === "VENTAS" && (
          <Ventas
            ventas={ventas}
            onSelectVenta={onSelectVenta}
            ventaSeleccionadaId={ventaSeleccionadaId}
            onFacturaChange={onFacturaChange}
          />
        )}
      </div>
    </div>
  );
}

/* ==========================
   SUBCOMPONENTES
========================== */

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.tab,
        ...(active ? styles.tabActive : {})
      }}
    >
      {children}
    </button>
  );
}

function Movimientos({ movimientos }) {
  if (!movimientos || movimientos.length === 0) {
    return <p style={{ opacity: 0.6 }}>Sin movimientos</p>;
  }

  return (
    <table style={styles.table}>
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
        {movimientos.map(m => (
          <tr key={m.id}>
            <td>{m.tipo}</td>
            <td>{m.formaPago}</td>
            <td
              style={{
                color: m.tipo === "EGRESO" ? "#b91c1c" : "#166534"
              }}
            >
              ${Number(m.monto).toFixed(2)}
            </td>
            <td>{m.concepto}</td>
            <td>
              {new Date(m.fecha).toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Ventas({ ventas, onSelectVenta, ventaSeleccionadaId, onFacturaChange }) {
  if (!ventas || ventas.length === 0) {
    return <p style={{ opacity: 0.6 }}>Sin ventas</p>;
  }

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th>Hora</th>
          <th>Total</th>
          <th>Forma pago</th>
          <th>Factura</th>
        </tr>
      </thead>
      <tbody>
        {ventas.map(v => {
  const seleccionada = v.id === ventaSeleccionadaId; return(
          <tr
            key={v.id}
            style={{...styles.rowClickable,
                  ...(seleccionada ? styles.rowSelected : {})}}
            onClick={() => onSelectVenta?.(v)}
          >
            <td>
              {new Date(v.fecha).toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
              })}
            </td>
            <td>${Number(v.total).toFixed(2)}</td>
            <td>{v.formaPago}</td>
            <td>
              <input
                type="text"
                defaultValue={v.factura || ""}
                placeholder="0001-00000001"
                style={styles.facturaInput}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                onBlur={(e) => onFacturaChange?.(v.id, e.target.value)}
              />
            </td>
          </tr>);
})}
      </tbody>
    </table>
  );
}

/* ==========================
   STYLES
========================== */

const styles = {
  empty: {
    padding: 16,
    textAlign: "center",
    color: "#666"
  },
  card: {
    padding: 12,
  },
  tabs: {
    display: "flex",
    gap: 8,
    marginBottom: 12
  },
  tab: {
    flex: 1,
    padding: "8px 0",
    border: "1px solid #ccc",
    borderRadius: 8,
    background: "#f3f4f6",
    cursor: "pointer",
    fontWeight: 500,
    color:"#000",
  },
  tabActive: {
    background: "#ff0000ff",
    color: "#fff",
    borderColor: "#bb0000ff"
  },
  content: {
    maxHeight: 300,
    overflowY: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  rowClickable: {
    cursor: "pointer"
  },
  rowSelected: {
    background: "#ff8181ff"
  },
  facturaInput: {
  width: 120,
  padding: "3px 6px",
  fontSize: 13,
  border: "1px solid #ccc",
  borderRadius: 6
}
};
