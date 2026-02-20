import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axiosInstance.post('/user/getUserData');
                    if (response.data.success) {
                        setUser(response.data.data);
                    } else {
                        localStorage.removeItem('token');
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Error fetching user", error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = (data) => {
        localStorage.setItem('token', data.token);
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
