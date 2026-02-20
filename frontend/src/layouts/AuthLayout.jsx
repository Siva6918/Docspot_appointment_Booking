import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children, title, subtitle, illustration }) => {
    return (
        <div className="min-h-screen w-full relative bg-brand-offWhite overflow-hidden">

            {/* Background Split */}
            <div className="absolute inset-0 flex">
                <div className="hidden lg:block w-1/2 bg-brand-soft/50 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 
                        -translate-x-1/2 -translate-y-1/2 
                        w-[600px] h-[600px] 
                        bg-brand-red/10 rounded-full blur-[100px]">
                    </div>
                </div>
                <div className="w-full lg:w-1/2 bg-white"></div>
            </div>

            {/* Main Container */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-screen">

                {/* LEFT SIDE */}
                <motion.div
                    className="hidden lg:flex flex-col justify-center items-center text-center px-12 py-16"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="relative mb-8">

                        {/* Glow */}
                        <div className="absolute inset-0 w-80 h-80 mx-auto 
                            bg-gradient-to-tr from-brand-red to-red-400 
                            rounded-full blur-[80px] opacity-20 animate-pulse">
                        </div>

                        <img
                            src={illustration || "https://cdn-icons-png.flaticon.com/512/3063/3063176.png"}
                            alt="Visual"
                            className="relative z-10 w-72 mx-auto drop-shadow-2xl"
                        />
                    </div>

                    <h1 className="text-4xl font-bold text-brand-dark mb-4">
                        {title}
                    </h1>

                    <p className="text-brand-dark/70 text-lg max-w-sm">
                        {subtitle}
                    </p>
                </motion.div>

                {/* RIGHT SIDE (Scrollable Form Area) */}
                <motion.div
                    className="flex items-center justify-center px-6 py-12 overflow-y-auto"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="w-full max-w-2xl">
                        <div className="bg-white/80 backdrop-blur-xl 
                            border border-brand-red/10 
                            shadow-xl rounded-3xl p-8">
                            {children}
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default AuthLayout;