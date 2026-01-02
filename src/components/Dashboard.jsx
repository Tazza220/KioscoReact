import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Ventas from './dashboard/Ventas';
import DashboardProductos from './dashboard/DashboardProductos';
import Proveedores from './dashboard/Proveedores';
import Usuarios from './dashboard/Usuarios';
import Reportes from './dashboard/Reportes';
import Compras from './dashboard/Compras';
import Stock from './dashboard/Stock';
import Caja from './dashboard/Caja';
import HistorialCajas from './dashboard/HistorialCajas';
import api from "../axiosConfig";
import { AuthContext } from '../AuthContext';

export default function Dashboard() {
  const { role } = useContext(AuthContext);
  const [cajaEstado, setCajaEstado] = useState(null);

  const cargarEstadoCaja = async () => {
  try {
    const r = await api.get("caja/estado");
    setCajaEstado(r.data);
  } catch {
    setCajaEstado({ abierta: false });
  }
};

useEffect(() => {
  cargarEstadoCaja();
}, []);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar role={role} cajaEstado={cajaEstado} />

      <div style={{ flex: 1, padding: 5, background: '#bcbfc0ff' }}>
        <Routes>
          <Route
            path="caja"
            element={<Caja recargarCajaEstado={cargarEstadoCaja} />}
          />

          <Route
            path=""
            element={
              <Navigate to="ventas" />
            }
          />

          {(role === 'Operator' || role === 'Manager' || role === 'SuperUser') &&
            <Route path="ventas" element={<Ventas cajaEstado={cajaEstado} />} />
          }

          {(role === 'Operator' || role === 'Manager' || role === 'SuperUser') &&
            <Route path="productos" element={<DashboardProductos alertaPrecioBajo={true} />} />
          }

          {role !== 'Operator' && (
            <>
              <Route path="proveedores" element={<Proveedores />} />
              <Route path="reportes" element={<Reportes />} />
            </>
          )}

          {role === 'SuperUser' && (
            <>
              <Route path="usuarios" element={<Usuarios />} />
              <Route path="compras" element={<Compras />} />
              <Route path="stock" element={<Stock />} />
              <Route path="caja" element={<Caja />} />
              <Route path="historial cajas" element={<HistorialCajas />} />
            </>
          )}

          <Route path="*" element={<div>Seleccione una opción del menú</div>} />
        </Routes>
      </div>
    </div>
  );
}
