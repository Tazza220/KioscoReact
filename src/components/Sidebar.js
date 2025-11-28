import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ role }) {
  const navigate = useNavigate();
  let options = [];

  if (role === 'Operator') options = ['ventas', 'productos'];
  if (role === 'Manager') options = ['ventas', 'productos', 'proveedores', 'reportes'];
  if (role === 'SuperUser') options = ['ventas', 'productos', 'proveedores', 'reportes', 'usuarios'];

  return (
    <div style={{ width: 200, background: '#2c3e50', color: '#ecf0f1', padding: 20 }}>
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
