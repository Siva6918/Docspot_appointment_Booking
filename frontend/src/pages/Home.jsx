import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import NeonButton from '../components/NeonButton';
import GlassCard from '../components/GlassCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    CpuChipIcon,
    ShieldCheckIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import DoctorImage from './Doctor.jpg';

const FeatureSection = ({ title, description, image, icon: Icon, reverse, bg }) => {
    return (
        <motion.div
            className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 py-24 px-6 ${bg ? bg : 'bg-white'}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <div className="flex-1 w-full relative">
                {/* Red Overlay on Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </div>
            <div className="flex-1 text-left space-y-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-brand-red/20 shadow-glow-soft">
                    <span className="text-3xl text-brand-red font-bold">#</span>
                </div>
                <h3 className="text-4xl font-bold text-brand-dark">{title}</h3>
                <p className="text-lg text-brand-dark/80 leading-relaxed">{description}</p>
                <div className="h-1 w-20 bg-brand-red rounded-full"></div>
            </div>
        </motion.div>
    );
};

const Home = () => {
    return (
        <div className="overflow-x-hidden bg-white min-h-screen relative font-sans text-brand-dark">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center pt-20 bg-white">
                {/* Subtle Brand Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-soft rounded-full blur-[120px] opacity-60"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-brand-offWhite rounded-full blur-[100px]"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-2 px-4 rounded-full bg-brand-offWhite border border-brand-red/10 text-brand-red text-sm font-bold tracking-wider mb-8">
                            PREMIUM HEALTHCARE v2.0
                        </span>
                        <h1 className="text-6xl md:text-7xl font-bold text-brand-dark mb-6 leading-tight">
                            Advanced Care. <br />
                            <span className="text-brand-red">Simplified.</span>
                        </h1>
                        <p className="text-xl text-brand-dark/70 mb-10 max-w-lg leading-relaxed">
                            Experience the red-carpet standard of digital healthcare.
                            Secure, efficient, and strictly professional.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/register">
                                <NeonButton variant="primary" className="px-8 py-4 text-lg">Get Started</NeonButton>
                            </Link>
                            <Link to="/apply-doctor">
                                <NeonButton variant="primary" className="px-8 py-4 text-lg">Apply as Doctor</NeonButton>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Hero Image / Hologram */}
                        <div className="relative w-full aspect-square max-w-lg mx-auto">
                            <div className="absolute inset-0 bg-brand-red/5 rounded-full blur-[60px]"></div>
                            <img
                                src={DoctorImage}
                                alt="Doctor Hologram"
                                className="relative z-10 w-full h-full object-contain rounded-full"
                            />
                            {/* Floating UI Cards */}
                            <GlassCard className="absolute top-10 -left-10 w-48 !p-4 animate-bounce delay-700 z-20 border-brand-red/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-brand-red rounded-full animate-ping"></div>
                                    <span className="text-sm font-bold text-brand-dark">System Online</span>
                                </div>
                            </GlassCard>
                            <GlassCard className="absolute bottom-20 -right-4 w-56 !p-4 animate-bounce delay-100 z-20 border-brand-red/10">
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-brand-offWhite border border-white flex items-center justify-center text-xs font-bold text-brand-red">
                                                Dr
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-sm text-brand-dark/70">500+ Experts</span>
                                </div>
                            </GlassCard>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Alternating Feature Sections */}
            <div className="w-full">
                <FeatureSection
                    title="Smart Doctor Matching"
                    description="AI-powered doctor discovery based on specialization and availability. We find the perfect match for your needs."
                    image="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    bg="bg-white"
                    reverse={false}
                />

                <FeatureSection
                    title="Real-Time Tracking"
                    description="Live status updates and secure scheduling. Stay informed every step of the way."
                    image="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    bg="bg-brand-soft" // Soft Red Background
                    reverse={true}
                />

                <FeatureSection
                    title="Secure Platform"
                    description="End-to-end secure login and medical document protection. Your data is encrypted."
                    image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    bg="bg-white"
                    reverse={false}
                />
            </div>

            {/* CTA Section */}
            <section className="relative py-32 text-center overflow-hidden bg-brand-offWhite">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-red/5"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-5xl md:text-6xl font-bold mb-8 text-brand-dark">
                            Ready to <span className="text-brand-red">Join?</span>
                        </h2>
                        <div className="flex justify-center gap-6">
                            <Link to="/register">
                                <NeonButton className="px-10 py-5 text-xl">
                                    Join the Network
                                </NeonButton>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
