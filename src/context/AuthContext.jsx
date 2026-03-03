import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Check localStorage on load
        const savedUser = localStorage.getItem('equaly_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const register = async (userData) => {
        try {
            const response = await fetch('https://equaly-api.vercel.app/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || (data.errors ? Object.values(data.errors).flat().join(', ') : 'Error al registrarse'));
            }

            return { success: true, data };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    };

    const login = async (credentials) => {
        try {
            const response = await fetch('https://api.equaly.co/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al iniciar sesión');
            }

            // Normalize user data structure
            const userData = {
                // Adjust these fields based on actual API response
                // Assuming standard Laravel/API response: { access_token: '...', user: { ... } }
                token: data.access_token || data.token,
                user: data.user || data.data,
                email: credentials.email
            };

            // Fallback for name if needed
            if (userData.user && !userData.user.name) {
                if (userData.user.first_name) {
                    userData.user.name = `${userData.user.first_name} ${userData.user.last_name || ''}`.trim();
                } else if (userData.user.nombres) {
                    userData.user.name = `${userData.user.nombres} ${userData.user.apellidos || ''}`.trim();
                }
            }
            // If user object is flat in data
            if (!userData.user && data.nombres) {
                userData.user = {
                    name: `${data.nombres} ${data.apellidos || ''}`.trim(),
                    email: data.email
                };
            }

            setUser(userData);
            localStorage.setItem('equaly_user', JSON.stringify(userData));

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('equaly_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
