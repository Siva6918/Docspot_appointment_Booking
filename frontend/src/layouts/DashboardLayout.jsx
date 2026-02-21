import React, { useContext, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    HomeIcon,
    CalendarIcon,
    UserIcon,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ to, icon: Icon, label, active, onClick }) => (
    <Link to={to} onClick={onClick} className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative
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
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { to: '/user', icon: HomeIcon, label: 'Overview', role: 'user' },
        { to: '/doctor', icon: CalendarIcon, label: 'Appointments', role: 'doctor' },
        { to: '/admin', icon: UserIcon, label: 'Manage Users', role: 'admin' },
    ];

    const filteredNavItems = navItems.filter(item => user?.role === item.role || item.role === 'user');

    return (
        <div className="min-h-screen bg-brand-offWhite flex">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed top-0 left-0 h-full w-64 bg-white border-r border-brand-red/10 flex flex-col p-6 z-50 md:hidden"
                        >
                            <div className="flex items-center justify-between mb-10 px-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-brand-red rounded-lg shadow-glow-soft flex items-center justify-center">
                                        <span className="text-white font-bold text-xl">D</span>
                                    </div>
                                    <span className="text-2xl font-bold text-brand-dark">DocSpot</span>
                                </div>
                                <button onClick={() => setSidebarOpen(false)} className="text-brand-dark/50 hover:text-brand-dark">
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <nav className="flex-1 space-y-2">
                                {filteredNavItems.map(item => (
                                    <SidebarItem
                                        key={item.to}
                                        to={item.to}
                                        icon={item.icon}
                                        label={item.label}
                                        active={location.pathname === item.to}
                                        onClick={() => setSidebarOpen(false)}
                                    />
                                ))}
                            </nav>

                            <button
                                onClick={() => { setSidebarOpen(false); handleLogout(); }}
                                className="flex items-center gap-3 px-4 py-3 text-brand-red hover:bg-brand-soft hover:text-brand-dark rounded-xl transition-all mt-auto font-bold"
                            >
                                <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                                <span>Logout</span>
                            </button>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
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
                    {filteredNavItems.map(item => (
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
            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-6 md:mb-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden text-brand-dark hover:text-brand-red transition-colors"
                        >
                            <Bars3Icon className="w-7 h-7" />
                        </button>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-dark">Dashboard</h2>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-brand-dark font-bold text-sm md:text-base">{user?.name}</p>
                            <p className="text-xs md:text-sm text-brand-dark/60 capitalize">{user?.role}</p>
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full border border-brand-red/20 flex items-center justify-center shadow-sm">
                            <span className="text-lg md:text-xl font-bold text-brand-red">{user?.name?.charAt(0)}</span>
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
