import React, { useState, useEffect } from 'react';
import api from '../../axiosConfig';

export default function Stock() {
  const [stock, setStock] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const cargarStock = async () => {
      try {
        const res = await api.get('/Stock');
        setStock(res.data);
      } catch (err) {
        console.error(err);
        alert("Error al cargar stock");
      }
    };

    cargarStock();
  }, []);

  // Filtrar por nombre o código
  const stockFiltrado = stock.filter(p =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    (p.codigoBarra && p.codigoBarra.includes(filtro))
  );

  return (
    <div style={{
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    height: "94%",
  }}>
      <h2>Stock Actualizado</h2>

      <input
        type="text"
        placeholder="Buscar por nombre o código..."
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
        style={styles.input}
      />

      <div style={styles.tablaContainer}>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
        <thead>
          <tr>
            <th style={styles.th}>Producto</th>
            <th style={styles.th}>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {stockFiltrado.map(p => (
            <tr key={p.productoId}>
              <td style={styles.td}>{p.nombre}</td>
              <td style={styles.td}>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
</div>
      {stockFiltrado.length === 0 && <p style={{ marginTop: 10, opacity: 0.6 }}>No se encontraron productos.</p>}
    </div>
  );
}

const styles = {
  input: {
    padding: 8,
    width: '50%',
    marginBottom: 10,
    borderRadius: 5,
    border: '1px solid #ccc'
  },
  tablaContainer: {
    maxHeight: '70vh', // altura máxima de la tabla
    overflowY: 'auto', // scroll vertical
    border: '1px solid #ddd',
    borderRadius: 5
  },
  th: {
    borderBottom: '1px solid #ccc',
    textAlign: 'left',
    padding: 8
  },
  td: {
    padding: 8,
    borderBottom: '1px solid #eee'
  }
};
