import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token on load
        const token = localStorage.getItem('token');
        if (token) {
            // Ideally validate token with backend here
            setUser({ token }); // Simplified
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/v1/auth/login', {
                email: email,
                password: password
            });

            const { access_token } = response.data;
            localStorage.setItem('token', access_token);
            setUser({ token: access_token });
            return true;
        } catch (error) {
            console.error("Login failed", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
            }
            alert(`Login Failed: ${error.response?.data?.detail || error.message}`);
            return false;
        }
    };

    const register = async (name, email, password, role, org_name) => {
        try {
            await axios.post('/api/v1/auth/register', {
                name, email, password, role, org_name
            });
            return true;
        } catch (error) {
            console.error("Registration failed", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
            }
            alert(`Registration Failed: ${error.response?.data?.detail || error.message}`);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
