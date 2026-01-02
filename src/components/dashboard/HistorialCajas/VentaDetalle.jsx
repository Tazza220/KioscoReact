export default function VentaDetalle({ venta }) {
  if (!venta) {
    return (
      <div style={styles.empty}>
        Seleccione una venta para ver el detalle
      </div>
    );
  }

  const total = venta.items?.reduce(
    (acc, i) => acc + Number(i.precioUnitario) * Number(i.cantidad),
    0
  ) ?? 0;

  return (
    <div style={styles.wrapper}>
      <hr/>
      <h3 style={styles.title}>🧾 Detalle de venta</h3>

      {/* ===== INFO GENERAL ===== */}
      <div style={styles.info}>
        <div><strong>ID:</strong> {venta.id}</div>
        <div>
          <strong>Fecha:</strong>{" "}
          {new Date(venta.fecha).toLocaleString("es-AR")}
        </div>
        <div><strong>Forma de pago:</strong> {venta.formaPago}</div>
        <div><strong>Comentario:</strong> {venta.comentario || "—"}</div>
      </div>

      {/* ===== ITEMS ===== */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cant.</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>

        <tbody>
          {venta.items?.map(i => (
            <tr key={i.id}>
              <td>{i.nombre || "Producto eliminado"}</td>
              <td>{i.cantidad}</td>
              <td>${Number(i.precioUnitario).toFixed(2)}</td>
              <td>
                ${(Number(i.precioUnitario) * Number(i.cantidad)).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== TOTAL ===== */}
      <div style={styles.total}>
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
}

/* ==========================
   STYLES
========================== */

const styles = {
  wrapper: {
    marginTop: 12,
    padding: 12,
  },
  title: {
    marginBottom: 10
  },
  empty: {
    padding: 20,
    textAlign: "center",
    color: "#666"
  },
  info: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 8,
    marginBottom: 12,
    fontSize: 14
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  total: {
    marginTop: 10,
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 18
  }
};
