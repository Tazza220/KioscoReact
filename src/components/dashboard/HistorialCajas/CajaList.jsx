export default function CajaList({ cajas, cajaSeleccionada, onSelect }) {
  if (!cajas || cajas.length === 0) {
    return <p style={{ opacity: 0.6 }}>No hay cajas</p>;
  }

  return (
    <ul style={styles.list}>
      {cajas.map((caja) => {
        const seleccionada = cajaSeleccionada?.id === caja.id;

        return (
          <li
            key={caja.id}
            onClick={() => onSelect(caja)}
            style={{
              ...styles.item,
              ...(seleccionada ? styles.itemActive : {})
            }}
          >
            <div style={styles.header}>
              <strong>Caja #{caja.id}</strong>
              <span
                style={{
                  ...styles.estado,
                  ...(caja.abierta ? styles.abierta : styles.cerrada)
                }}
              >
                {caja.abierta ? "Abierta" : "Cerrada"}
              </span>
            </div>

            <div style={styles.info}>
              <div>
                <small>Apertura</small>
                <div>{formatFecha(caja.fechaApertura)}</div>
                <div>${Number(caja.saldoApertura).toFixed(2)}</div>

              </div>

              {caja.fechaCierre && (
                <div>
                  <small>Cierre</small>
                  <div>{formatFecha(caja.fechaCierre)}</div>
                  <div>${Number(caja.saldoCierre).toFixed(2)}</div>

                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ==========================
   HELPERS
========================== */

function formatFecha(fecha) {
  if (!fecha) return "-";
  return new Date(fecha).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

/* ==========================
   STYLES
========================== */

const styles = {
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 8
  },
  item: {
    cursor: "pointer",
    border: "1px solid #c6c6c6ff",
    borderRadius: 8,
    padding: "10px 12px",
    transition: "all 0.15s ease",
    background: "#e8e8e8ff"
  },
  itemActive: {
    borderColor: "#2563eb",
    background: "#e3efffff"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6
  },
  estado: {
    fontSize: 12,
    padding: "2px 6px",
    borderRadius: 6
  },
  abierta: {
    background: "#dcfce7",
    color: "#166534"
  },
  cerrada: {
    background: "#fee2e2",
    color: "#991b1b"
  },
  info: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    color: "#555"
  }
};
