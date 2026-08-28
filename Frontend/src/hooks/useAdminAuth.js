// src/hooks/useAdminAuth.js

import { useState, useEffect } from 'react';

export function useAdminAuth() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    verifySession();
  }, []);

  const verifySession = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost/educraft-backend/api/auth/verify.php', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setAdmin(data.data);
        setError(null);
        return true;
      } else {
        setAdmin(null);
        return false;
      }
    } catch (err) {
      console.error('Error verificando sesión:', err);
      setAdmin(null);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const response = await fetch('http://localhost/educraft-backend/api/auth/login.php', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setAdmin(data.data);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        return { success: true, message: data.message };
      } else {
        setError(data.message);
        return { success: false, message: data.message };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);

      const response = await fetch('http://localhost/educraft-backend/api/auth/logout.php', {
        method: 'POST',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setAdmin(null);
        setError(null);
        return { success: true };
      } else {
        setError(data.message);
        return { success: false };
      }
    } catch (err) {
      setError(err.message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    admin,
    loading,
    error,
    login,
    logout,
    isAuthenticated: admin !== null
  };
}