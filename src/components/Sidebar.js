import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ role }) {
  const navigate = useNavigate();
  let options = [];

  if (role === 'Operator') options = ['ventas', 'productos'];
  if (role === 'Manager') options = ['ventas', 'productos', 'proveedores', 'reportes','compras','stock'];
  if (role === 'SuperUser') options = ['ventas', 'caja', 'productos', 'proveedores', 'reportes', 'usuarios', 'compras', 'stock'];

  return (
    <div style={{ width: 100, background: '#502c2cff', color: '#ffffffff', padding: 20 }}>
      <h3>Menú</h3>
      {options.map(opt => (
        <div
          key={opt}
          style={{ padding: '10px', cursor: 'pointer', textTransform: 'capitalize' }}
          onClick={() => navigate(`/dashboard/${opt}`)}
        >
          {opt}
        </div>
      ))}
    </div>
  );
}
