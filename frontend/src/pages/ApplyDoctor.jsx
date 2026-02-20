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
import {
    UserIcon, EnvelopeIcon, PhoneIcon, LockClosedIcon,
    BriefcaseIcon, AcademicCapIcon, MapPinIcon, CurrencyDollarIcon,
    ClockIcon, DocumentTextIcon
} from '@heroicons/react/24/outline';

const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
    password: z.string().min(8),
    specialization: z.string().min(2),
    experience: z.string().min(1),
    fees: z.string().min(1),
    address: z.string().min(5),
    timings: z.string().min(1)
});

const ApplyDoctor = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } =
        useForm({ resolver: zodResolver(schema) });

    const [file, setFile] = useState(null);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();

            Object.keys(data).forEach(key => {
                if (key === "timings") {
                    formData.append("timings", JSON.stringify([data.timings]));
                } else {
                    formData.append(key, data[key]);
                }
            });

            if (file) formData.append("docImg", file);

            const res = await axiosInstance.post(
                "/doctor/apply-public",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Application Failed");
        }
    };

    return (
        <AuthLayout
            title="Join Our Medical Network"
            subtitle="Connect with patients, manage appointments, and grow your digital presence securely."
            illustration="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
        >

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {/* Personal */}
                <div>
                    <h3 className="text-2xl font-bold text-brand-red mb-6">
                        Personal Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="Full Name" icon={UserIcon} error={errors.name} {...register('name')} />
                        <InputGroup label="Email" icon={EnvelopeIcon} error={errors.email} {...register('email')} />
                        <InputGroup label="Phone" icon={PhoneIcon} error={errors.phone} {...register('phone')} />
                        <InputGroup label="Password" type="password" icon={LockClosedIcon} error={errors.password} {...register('password')} />
                        <InputGroup label="Address" icon={MapPinIcon} error={errors.address} {...register('address')} className="md:col-span-2" />
                    </div>
                </div>

                {/* Professional */}
                <div>
                    <h3 className="text-2xl font-bold text-brand-red mb-6">
                        Professional Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="Specialization" icon={BriefcaseIcon} error={errors.specialization} {...register('specialization')} />
                        <InputGroup label="Experience" icon={AcademicCapIcon} error={errors.experience} {...register('experience')} />
                        <InputGroup label="Fees per Visit" type="number" icon={CurrencyDollarIcon} error={errors.fees} {...register('fees')} />
                        <InputGroup label="Timings" icon={ClockIcon} error={errors.timings} {...register('timings')} />

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-brand-red mb-2 flex items-center gap-2">
                                <DocumentTextIcon className="w-4 h-4" />
                                Verification Document (Image / PDF)
                            </label>

                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="w-full px-4 py-3 rounded-xl border border-brand-red/20
                                focus:border-brand-red focus:ring-1 focus:ring-brand-red
                                transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full
                                file:border-0 file:text-sm file:font-bold
                                file:bg-brand-red file:text-white hover:file:bg-red-700 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <NeonButton
                    type="submit"
                    className="w-full bg-brand-red hover:bg-red-700 text-white py-3 rounded-xl"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                </NeonButton>

                <p className="text-center text-brand-dark/70 mt-4">
                    Already registered?{" "}
                    <Link to="/login" className="text-brand-red font-bold hover:underline">
                        Login
                    </Link>
                </p>

            </form>

        </AuthLayout>
    );
};

export default ApplyDoctor;