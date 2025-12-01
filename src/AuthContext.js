import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);

      try {
        const decoded = jwtDecode(token);
        
        const id = decoded.nameid;
        console.log(id);
        setUserId(id);
        localStorage.setItem('userId', id);
      } catch (err) {
        console.error("Error decoding token:", err);
      }

    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setUserId('');
    }

    if (role) localStorage.setItem('role', role);
    else localStorage.removeItem('role');
    
  }, [token, role]);

  return (
    <AuthContext.Provider value={{ token, setToken, role, setRole, userId }}>
      {children}
    </AuthContext.Provider>
  );
};


