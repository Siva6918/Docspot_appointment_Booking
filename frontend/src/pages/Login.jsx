import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../services/axiosInstance';
import { toast } from 'react-toastify';
import AuthLayout from '../layouts/AuthLayout';
import InputGroup from '../components/InputGroup';
import NeonButton from '../components/NeonButton';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            const res = await axiosInstance.post('/user/login', data);
            if (res.data.success) {
                login(res.data);
                toast.success('Access Granted');

                const role = res.data.user.role;
                if (role === 'admin') {
                    navigate('/admin');
                } else if (role === 'doctor') {
                    navigate('/doctor');
                } else {
                    navigate('/user');
                }
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login Failed');
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Enter the Metaverse Health Portal"
            illustration="https://cdn-icons-png.flaticon.com/512/3063/3063176.png"
        >
            <div className="glass-card p-8 w-full max-w-md mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <InputGroup
                        label="Email Address"
                        type="email"
                        icon={EnvelopeIcon}
                        placeholder="name@example.com"
                        error={errors.email}
                        {...register('email')}
                    />

                    <InputGroup
                        label="Password"
                        type="password"
                        icon={LockClosedIcon}
                        placeholder="••••••••"
                        error={errors.password}
                        {...register('password')}
                    />

                    <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center gap-2 text-brand-dark/70 cursor-pointer">
                            <input type="checkbox" className="rounded bg-brand-offWhite border-brand-red/20 text-brand-red focus:ring-brand-red" />
                            <span>Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="text-brand-red hover:text-brand-dark transition-colors">Forgot Password?</Link>
                    </div>

                    <NeonButton type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Authenticating...' : 'Secure Login'}
                    </NeonButton>

                    <p className="text-center text-brand-dark/70 mt-6">
                        New entity? <Link to="/register" className="text-brand-red font-bold hover:text-brand-dark">Initialize Identity</Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
};

export default Login;
