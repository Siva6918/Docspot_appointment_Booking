import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import { toast } from 'react-toastify';
import AuthLayout from '../layouts/AuthLayout';
import InputGroup from '../components/InputGroup';
import NeonButton from '../components/NeonButton';
import { EnvelopeIcon, LockClosedIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone must be at least 10 digits'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain one uppercase letter')
        .regex(/[a-z]/, 'Must contain one lowercase letter')
        .regex(/[0-9]/, 'Must contain one number')
        .regex(/[^A-Za-z0-9]/, 'Must contain one special character'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const Register = () => {
    const navigate = useNavigate();
    const [passwordStrength, setPasswordStrength] = useState(0);
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema)
    });

    const password = watch('password');

    React.useEffect(() => {
        if (!password) {
            setPasswordStrength(0);
            return;
        }
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^A-Za-z0-9]/)) strength++;
        setPasswordStrength(strength);
    }, [password]);

    const getStrengthColor = () => {
        if (passwordStrength <= 1) return 'bg-brand-light'; // Weak
        if (passwordStrength <= 3) return 'bg-brand-red';   // Medium
        return 'bg-brand-dark';                             // Strong
    };

    const onSubmit = async (data) => {
        try {
            // Remove confirmPassword before sending
            const { confirmPassword, ...registerData } = data;
            const res = await axiosInstance.post('/user/register', registerData);
            if (res.data.success) {
                toast.success('Identity Created Successfully');
                navigate('/login');
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration Failed');
        }
    };

    return (
        <AuthLayout
            title="Join the Network"
            subtitle="Create your secure digital health identity"
            illustration="https://cdn-icons-png.flaticon.com/512/4600/4600989.png"
        >
            <div className="glass-card p-8 w-full max-w-md mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <InputGroup
                        label="Full Name"
                        type="text"
                        icon={UserIcon}
                        placeholder="John Doe"
                        error={errors.name}
                        {...register('name')}
                    />

                    <InputGroup
                        label="Email"
                        type="email"
                        icon={EnvelopeIcon}
                        placeholder="john@example.com"
                        error={errors.email}
                        {...register('email')}
                    />

                    <InputGroup
                        label="Phone"
                        type="tel"
                        icon={PhoneIcon}
                        placeholder="+1 234 567 8900"
                        error={errors.phone}
                        {...register('phone')}
                    />

                    <div>
                        <InputGroup
                            label="Password"
                            type="password"
                            icon={LockClosedIcon}
                            placeholder="••••••••"
                            error={errors.password}
                            {...register('password')}
                        />
                        {/* Password Strength Meter */}
                        {password && (
                            <div className="w-full h-1 bg-brand-offWhite rounded-full mt-1 overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                                ></div>
                            </div>
                        )}
                        <p className="text-xs text-brand-dark/50 mt-1">Min 8 chars, mixed case, number, symbol</p>
                    </div>

                    <InputGroup
                        label="Confirm Password"
                        type="password"
                        icon={LockClosedIcon}
                        placeholder="••••••••"
                        error={errors.confirmPassword}
                        {...register('confirmPassword')}
                    />

                    <NeonButton type="submit" variant="secondary" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating Identity...' : 'Initialize Profile'}
                    </NeonButton>

                    <p className="text-center text-brand-dark/70 mt-4">
                        Already have an identity? <Link to="/login" className="text-brand-red font-bold hover:text-brand-dark">Access Portal</Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
};

export default Register;
