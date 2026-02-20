import React from 'react';
import { motion } from 'framer-motion';

const NeonButton = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) => {
    const variants = {
        primary: 'bg-brand-red text-white hover:bg-brand-dark shadow-glow-soft hover:shadow-glow',
        secondary: 'bg-brand-red text-white hover:bg-brand-dark shadow-glow-soft hover:shadow-glow',
        outline: 'bg-transparent text-brand-red border border-brand-red hover:bg-brand-red hover:text-white',
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                relative px-6 py-3 font-bold text-white rounded-xl transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant] || variants.primary}
                ${className}
            `}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
        >
            {children}
        </motion.button>
    );
};

export default NeonButton;
