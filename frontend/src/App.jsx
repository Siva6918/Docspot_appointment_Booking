import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ApplyDoctor from './pages/ApplyDoctor';
import UserDashboard from './pages/dashboard/UserDashboard';
import DoctorDashboard from './pages/dashboard/DoctorDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';



function App() {
    // REPLACE 'YOUR_GOOGLE_CLIENT_ID' WITH YOUR ACTUAL GOOGLE CLIENT ID FROM GOOGLE CLOUD CONSOLE
    // You can also use import.meta.env.VITE_GOOGLE_CLIENT_ID
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

    return (
        <BrowserRouter future={{ v7_relativeSplatPath: true }}>
            <AuthProvider>
                <ToastContainer theme="light" position="bottom-right" />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/apply-doctor" element={<ApplyDoctor />} />

                    <Route element={<DashboardLayout />}>
                        <Route path="user" element={
                            <ProtectedRoute allowedRoles={['user']}>
                                <UserDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="doctor" element={
                            <ProtectedRoute allowedRoles={['doctor']}>
                                <DoctorDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="admin" element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>

    );
}

export default App;
