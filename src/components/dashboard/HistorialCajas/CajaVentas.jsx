export default function CajaVentas({
  
  ventas = [],
  ventaSeleccionadaId,
  onSelectVenta,
  onFacturaChange
}) {
  if (!ventas || ventas.length === 0) {
    return (
      <div style={styles.empty}>
        No hay ventas registradas
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Hora</th>
            <th>Total</th>
            <th>Forma pago</th>
            <th>Comentario</th>
            <th>Factura</th>
          </tr>
        </thead>

        <tbody>
          {ventas.map(v => {
            const seleccionada = v.id === ventaSeleccionadaId;

            return (
              <tr
                key={v.id}
                onClick={() => onSelectVenta(v)}
                style={{
                  ...styles.row,
                  ...(seleccionada ? styles.rowSelected : {})
                }}
              >
                <td>
                  {new Date(v.fecha).toLocaleTimeString("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                  })}
                </td>

                <td style={{ fontWeight: 600 }}>
                  ${Number(v.total).toFixed(2)}
                </td>

                <td>
                  {v.formaPago}
                </td>

                <td style={styles.comentario}>
                  {v.comentario || "—"}
                </td>

                <td>
                  <input
                    type="text"
                    defaultValue={v.factura || ""}
                    placeholder="001-0000001"
                    style={styles.facturaInput}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    onBlur={(e) => onFacturaChange?.(v.id, e.target.value)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ==========================
   STYLES
========================== */

  console.log("seleccionada:", v.id, ventaSeleccionadaId);

const styles = {
  wrapper: {
    maxHeight: 320,
    overflowY: "auto"
  },
  empty: {
    padding: 16,
    textAlign: "center",
    color: "#666"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  row: {
    cursor: "pointer"
  },
  rowSelected: {
    background: "#51b9ffff"
  },
  comentario: {
    maxWidth: 220,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
};
