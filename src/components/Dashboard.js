import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Ventas from './dashboard/Ventas';
import Productos from './dashboard/Productos';
import DashboardProductos from './dashboard/DashboardProductos';
import Proveedores from './dashboard/Proveedores';
import Usuarios from './dashboard/Usuarios';
import Reportes from './dashboard/Reportes';
import { AuthContext } from './../AuthContext';

export default function Dashboard() {
  const { role } = useContext(AuthContext);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar role={role} />
      <div style={{ flex: 1, padding:5, background: '#ecf0f1' }}>
        <Routes>
          {/* Redirección automática al primer menú permitido según rol */}
          <Route
            path=""
            element={
              role === 'Operator' ? <Navigate to="ventas" /> :
              role === 'Manager' ? <Navigate to="ventas" /> :
              role === 'SuperUser' ? <Navigate to="usuarios" /> :
              <div>No autorizado</div>
            }
          />

          {/* Rutas internas */}
          {role === 'Operator' && <Route path="ventas" element={<Ventas />} />}
          {role === 'Operator' && <Route path="productos" element={<DashboardProductos alertaPrecioBajo={true} />} />}

          {role === 'Manager' && <Route path="ventas" element={<Ventas />} />}
          {role === 'Manager' && <Route path="productos" element={<DashboardProductos alertaPrecioBajo={true} />} />}
          {role === 'Manager' && <Route path="proveedores" element={<Proveedores />} />}
          {role === 'Manager' && <Route path="reportes" element={<Reportes />} />}

          {role === 'SuperUser' && <Route path="ventas" element={<Ventas />} />}
          {role === 'SuperUser' && <Route path="productos" element={<DashboardProductos alertaPrecioBajo={true} />} />}
          {role === 'SuperUser' && <Route path="proveedores" element={<Proveedores />} />}
          {role === 'SuperUser' && <Route path="reportes" element={<Reportes />} />}
          {role === 'SuperUser' && <Route path="usuarios" element={<Usuarios />} />}

          {/* Ruta fallback */}
          <Route path="*" element={<div>Seleccione una opción del menú</div>} />
        </Routes>
      </div>
    </div>
  );
}
