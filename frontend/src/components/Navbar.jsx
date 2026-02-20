import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NeonButton from './NeonButton';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Apply as Doctor', path: '/apply-doctor' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-xl">D</span>
                    </div>
                    <span className={`text-2xl font-bold tracking-wide ${scrolled ? 'text-brand-dark' : 'text-brand-dark'}`}>
                        Doc<span className="text-brand-red">Spot</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-sm font-bold transition-colors hover:text-brand-red ${location.pathname === link.path
                                ? 'text-brand-red'
                                : 'text-brand-dark/70'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link to="/login">
                        <NeonButton variant="primary" className="px-6 py-2 text-sm shadow-glow-soft">
                            Login
                        </NeonButton>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-brand-dark hover:text-brand-red transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 p-6 flex flex-col gap-4 shadow-2xl">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-lg font-bold ${location.pathname === link.path ? 'text-brand-red' : 'text-brand-dark/70'
                                }`}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                        <NeonButton variant="primary" className="w-full justify-center">
                            Login Portal
                        </NeonButton>
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
