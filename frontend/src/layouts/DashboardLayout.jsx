import React, { useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    HomeIcon,
    CalendarIcon,
    UserIcon,
    ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const SidebarItem = ({ to, icon: Icon, label, active }) => (
    <Link to={to} className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
        ${active ? 'bg-brand-red/10 text-brand-red shadow-glow-soft' : 'text-brand-dark/70 hover:bg-brand-offWhite hover:text-brand-dark'}
    `}>
        <Icon className="w-6 h-6" />
        <span className="font-bold">{label}</span>
        {active && <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-8 bg-brand-red rounded-r-full" />}
    </Link>
);

const DashboardLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { to: '/user', icon: HomeIcon, label: 'Overview', role: 'user' },
        { to: '/doctor', icon: CalendarIcon, label: 'Appointments', role: 'doctor' },
        { to: '/admin', icon: UserIcon, label: 'Manage Users', role: 'admin' },
    ];

    return (
        <div className="min-h-screen bg-brand-offWhite flex">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                className="w-64 bg-white border-r border-brand-red/10 hidden md:flex flex-col p-6"
            >
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-brand-red rounded-lg shadow-glow-soft flex items-center justify-center">
                        <span className="text-white font-bold text-xl">D</span>
                    </div>
                    <span className="text-2xl font-bold text-brand-dark">DocSpot</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.filter(item => user?.role === item.role || item.role === 'user').map(item => (
                        <SidebarItem
                            key={item.to}
                            to={item.to}
                            icon={item.icon}
                            label={item.label}
                            active={location.pathname === item.to}
                        />
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-brand-red hover:bg-brand-soft hover:text-brand-dark rounded-xl transition-all mt-auto font-bold"
                >
                    <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                    <span>Logout</span>
                </button>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-brand-dark">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-brand-dark font-bold">{user?.name}</p>
                            <p className="text-sm text-brand-dark/60 capitalize">{user?.role}</p>
                        </div>
                        <div className="w-12 h-12 bg-white rounded-full border border-brand-red/20 flex items-center justify-center shadow-sm">
                            <span className="text-xl font-bold text-brand-red">{user?.name?.charAt(0)}</span>
                        </div>
                    </div>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Outlet />
                </motion.div>
            </main>
        </div>
    );
};

export default DashboardLayout;
