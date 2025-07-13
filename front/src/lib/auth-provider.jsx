// 'use client'
// import React, { createContext, useState, useEffect, useContext } from 'react';
// import * as jwt from 'jsonwebtoken';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// const jwt_decode = jwt.decode;
// const AuthContext = createContext(null);

// const queryClient = new QueryClient();

// export const AuthProvider = ({ children }) => {
//     const [token, setToken] = useState(null);
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const storedToken = sessionStorage.getItem('token');
//         if (storedToken) {
//             setToken(storedToken);
//             try {
//                 const decodedUser = decodeJwt(storedToken);
//                 setUser(decodedUser);
//             } catch (error) {
//                 console.error("Error decoding token:", error);
//                 logout();
//             }
//         }
//         setLoading(false);
//     }, []);

//     const login = (newToken) => {
//         sessionStorage.setItem('token', newToken);
//         setToken(newToken);
//         const decodedUser = decodeJwt(newToken);
//         setUser(decodedUser);
//     };

//     const logout = () => {
//         sessionStorage.removeItem('token');
//         setToken(null);
//         setUser(null);
//     };

//     const getUserIdFromToken = () => {
//         try {
//             if (!token) return null;

//             const decodedToken = jwt_decode(token);
//             return decodedToken.userId;
//         } catch (error) {
//             console.error("Error decoding token:", error);
//             return null;
//         }
//     };

//     const value = {
//         token,
//         user,
//         login,
//         logout,
//         loading,
//         getUserIdFromToken
//     };

//     return (
//         <QueryClientProvider client={queryClient}>
//             <AuthContext.Provider value={value}>
//                 {loading ? <div>Loading Auth...</div> : children}
//             </AuthContext.Provider>
//         </QueryClientProvider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);

// const decodeJwt = (token) => {
//     try {
//         const base64Url = token.split('.')[1];
//         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//         const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
//             return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//         }).join(''));

//         return JSON.parse(jsonPayload);
//     } catch (error) {
//         console.error("Error decoding JWT:", error);
//         return null;
//     }
// };

'use client'
import React, { createContext, useState, useEffect, useContext } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const AuthContext = createContext(null);
const queryClient = new QueryClient();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const verifyToken = async (token) => {
        try {
            const response = await fetch('http://localhost:8088/api/v1/auth/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Invalid token');
            }

            return await response.json();
        } catch (error) {
            console.error("Token verification failed:", error);
            throw error;
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = sessionStorage.getItem('token');
            if (storedToken) {
                try {
                    const userData = await verifyToken(storedToken);
                    setToken(storedToken);
                    setUser(userData);
                } catch (error) {
                    console.error("Token validation error:", error);
                    logout();
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (newToken) => {
        try {
            const userData = await verifyToken(newToken);
            sessionStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        if (token) {
            try {
                // Опционально: инвалидация токена на сервере
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.error("Logout error:", error);
            }
        }

        sessionStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const getUserId = () => {
        return user?.userId || null;
    };

    const value = {
        token,
        user,
        login,
        logout,
        loading,
        getUserId
    };

    return (
        <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={value}>
                {loading ? <div>Loading Auth...</div> : children}
            </AuthContext.Provider>
        </QueryClientProvider>
    );
};

export const useAuth = () => useContext(AuthContext);