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
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            
            if (response.ok && data.state) {
                setToken(data.token);
                return { success: true };
            } else {
                return { success: false, message: data.msg || 'Login failed' };
            }
        } catch (error) {
            return { success: false, message: 'Server connection failed' };
        }
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
