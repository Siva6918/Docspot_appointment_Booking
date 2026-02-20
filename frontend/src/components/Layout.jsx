import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
    return (
        <>
            <Navbar />
            <main className="container mt-4">
                <Outlet />
            </main>
            <ToastContainer />
        </>
    );
};

export default Layout;
