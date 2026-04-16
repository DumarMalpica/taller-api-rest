import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser(decoded);
                    localStorage.setItem('token', token);
                }
            } catch (err) {
                console.error("Invalid token:", err);
                logout();
            }
        } else {
            setUser(null);
            localStorage.removeItem('token');
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            // Intelligent URL detection
            const isProd = window.location.hostname.includes('vercel.app');
            const RENDER_URL = 'https://taller-api-rest-mom1.onrender.com';
            const API_URL = isProd ? RENDER_URL : (import.meta.env.VITE_API_URL || 'http://localhost:3000');
            
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            
            if (response.ok && data.state) {
                // We no longer set the token here, just return it
                return { success: true, token: data.token };
            } else {
                return { success: false, message: data.msg || 'Fallo al iniciar sesión' };
            }
        } catch (error) {
            console.error("Login connection error:", error);
            return { 
                success: false, 
                message: 'El servidor está iniciando (estado de hibernación). Por favor espera 30 segundos y vuelve a intentar.' 
            };
        }
    };

    const setManualToken = (manualToken) => {
        try {
            const decoded = jwtDecode(manualToken);
            setToken(manualToken); // This triggers the useEffect to save and set user
            return { success: true };
        } catch (err) {
            return { success: false, message: 'Formato de Token JWT inválido' };
        }
    }

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, setManualToken }}>
            {children}
        </AuthContext.Provider>
    );
};
