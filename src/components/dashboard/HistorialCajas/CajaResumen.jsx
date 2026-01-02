export default function CajaResumen({ caja }) {
  if (!caja) return null;

  return (
    <div className="caja-resumen">

      {/* RESUMEN */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>F. Pago</th>
            <th>Ventas</th>
            <th>Ing.</th>
            <th>Egr.</th>
            <th>Saldo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
    {caja.resumenPorFormaPago?.map((r, index) => (
      <tr
        key={r.formaPago}
        style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
      >
        <td>{r.formaPago}</td>
        <td>${r.ventas.toFixed(2)}</td>
        <td>${r.ingresos.toFixed(2)}</td>
        <td>${r.egresos.toFixed(2)}</td>
        <td>
          <strong>${r.saldo.toFixed(2)}</strong>
        </td>
        <td></td>
      </tr>
    ))}
  </tbody>
      </table>
    </div>
  );
}
const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  rowEven: {
    backgroundColor: "#ffffff"
  },
  rowOdd: {
    backgroundColor: "#f0f0f0"
  }
};
