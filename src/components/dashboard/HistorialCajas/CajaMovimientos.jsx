export default function CajaMovimientos({ movimientos = [] }) {
  if (!movimientos || movimientos.length === 0) {
    return (
      <div style={styles.empty}>
        No hay movimientos registrados
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Hora</th>
            <th>Tipo</th>
            <th>Forma pago</th>
            <th>Monto</th>
            <th>Concepto</th>
          </tr>
        </thead>

        <tbody>
          {movimientos.map(m => (
            <tr key={m.id}>
              <td>
                {new Date(m.fecha).toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false
                })}
              </td>

              <td>
                {m.tipo}
              </td>

              <td>
                {m.formaPago}
              </td>

              <td
                style={{
                  color: m.tipo === "EGRESO" ? "#b91c1c" : "#166534",
                  fontWeight: 600
                }}
              >
                ${Number(m.monto).toFixed(2)}
              </td>

              <td>
                {m.concepto}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ==========================
   STYLES
========================== */

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
  }
};
