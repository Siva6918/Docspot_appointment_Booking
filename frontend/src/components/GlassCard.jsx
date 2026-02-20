import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '' }) => {
    return (
        <motion.div
            className={`glass-card p-6 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
