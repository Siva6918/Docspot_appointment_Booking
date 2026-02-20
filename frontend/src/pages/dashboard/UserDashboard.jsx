import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { toast } from 'react-toastify';
import GlassCard from '../../components/GlassCard';
import NeonButton from '../../components/NeonButton';
import {
    CalendarDaysIcon,
    DocumentArrowUpIcon,
    CheckCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const UserDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        getDoctors();
        getAppointments();
    }, []);

    const getDoctors = async () => {
        try {
            const res = await axiosInstance.get('/doctor/getAllDoctors');
            if (res.data.success) {
                setDoctors(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getAppointments = async () => {
        try {
            const res = await axiosInstance.get('/appointment/user-appointments');
            if (res.data.success) {
                setAppointments(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleBook = async (doctorId, doctorUserId) => {
        const formData = new FormData();
        formData.append('doctorId', doctorId);
        formData.append('doctorUserId', doctorUserId);
        formData.append('date', new Date().toISOString());
        formData.append('userInfo[name]', 'User');

        if (selectedFile) {
            formData.append('document', selectedFile);
        }

        try {
            const res = await axiosInstance.post('/appointment/book-appointment', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                toast.success(res.data.message);
                getAppointments();
                setSelectedFile(null);
            }
        } catch (error) {
            toast.error('Booking Failed');
        }
    };

    return (
        <div className="space-y-12">
            {/* Header / Stats Section (Optional) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="flex items-center gap-4 border-l-4 border-l-brand-red">
                    <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center text-brand-red">
                        <CalendarDaysIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-brand-dark/70 text-sm font-bold">Total Appointments</p>
                        <h3 className="text-2xl font-bold text-brand-dark">{appointments.length}</h3>
                    </div>
                </GlassCard>
            </div>

            {/* Doctors Section */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-brand-dark flex items-center gap-3">
                        <span className="w-1 h-8 bg-brand-red rounded-full"></span>
                        Available Specialists
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {doctors.map(doc => (
                        <GlassCard key={doc._id} className="relative group hover:shadow-glow-soft transition-all duration-300">
                            <div className="absolute top-4 right-4 px-3 py-1 bg-brand-red/5 text-brand-red text-xs font-bold rounded-full border border-brand-red/10">
                                VERIFIED
                            </div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-brand-red/10 shadow-sm">
                                    <span className="text-2xl font-bold text-brand-red">{doc.fullname?.[0] || 'D'}</span>
                                </div>
                                <div>
                                    <h5 className="text-xl font-bold text-brand-dark">{doc.fullname}</h5>
                                    <p className="text-brand-red font-medium">{doc.specialization}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-sm text-brand-dark/60 border-b border-brand-red/10 pb-2">
                                    <span>Consultation Fee</span>
                                    <span className="text-brand-dark font-bold">${doc.fees}</span>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-brand-dark/70 mb-2">
                                        Medical History (Optional)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            className="hidden"
                                            id={`file-${doc._id}`}
                                            onChange={handleFileChange}
                                        />
                                        <label
                                            htmlFor={`file-${doc._id}`}
                                            className="flex items-center justify-center w-full px-4 py-2 border border-dashed border-brand-red/30 rounded-xl cursor-pointer hover:border-brand-red hover:text-brand-red transition-colors text-sm text-brand-dark/60"
                                        >
                                            <DocumentArrowUpIcon className="w-4 h-4 mr-2" />
                                            {selectedFile ? 'File Selected' : 'Upload Report'}
                                        </label>
                                    </div>
                                </div>

                                <NeonButton
                                    className="w-full"
                                    onClick={() => handleBook(doc._id, doc.userId)}
                                >
                                    Book Appointment
                                </NeonButton>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </section>

            {/* Appointments Section */}
            <section>
                <h3 className="text-2xl font-bold text-brand-dark flex items-center gap-3 mb-6">
                    <span className="w-1 h-8 bg-brand-red rounded-full"></span>
                    My Schedule
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-brand-dark/70 text-sm border-b border-brand-red/10">
                                <th className="py-4 px-4 font-medium">Date & Time</th>
                                <th className="py-4 px-4 font-medium">Status</th>
                                <th className="py-4 px-4 font-medium">Documents</th>
                                <th className="py-4 px-4 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-brand-dark">
                            {appointments.map(app => (
                                <tr key={app._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-brand-offWhite flex items-center justify-center text-brand-dark/50">
                                                <CalendarDaysIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-brand-dark">{new Date(app.date).toLocaleDateString()}</p>
                                                <p className="text-xs text-brand-dark/50">{new Date(app.date).toLocaleTimeString()}</p>
                                                {app.appointmentTime && (
                                                    <p className="text-xs text-brand-red font-medium mt-1 flex items-center gap-1">
                                                        <ClockIcon className="w-3 h-3" />
                                                        Scheduled: {new Date(app.appointmentTime).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`
                                            px-3 py-1 rounded-full text-xs font-bold border
                                            ${app.status === 'scheduled'
                                                ? 'bg-brand-red/10 text-brand-red border-brand-red/20'
                                                : app.status === 'pending'
                                                    ? 'bg-brand-soft text-brand-dark/70 border-brand-red/10'
                                                    : app.status === 'cancelled'
                                                        ? 'bg-brand-dark/10 text-brand-dark border-brand-dark/20'
                                                        : 'bg-brand-dark/10 text-brand-dark border-brand-dark/20'}
                                        `}>
                                            {app.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        {app.document ? (
                                            <span className="flex items-center text-brand-red text-sm">
                                                <CheckCircleIcon className="w-4 h-4 mr-1" /> Uploaded
                                            </span>
                                        ) : (
                                            <span className="text-brand-dark/50 text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        <button className="text-brand-dark/30 hover:text-brand-dark transition-colors">
                                            <span className="sr-only">Details</span>
                                            ...
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default UserDashboard;
