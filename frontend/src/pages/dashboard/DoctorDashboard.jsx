import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import GlassCard from '../../components/GlassCard';
import NeonButton from '../../components/NeonButton';
import { CalendarIcon, CheckIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';

const DoctorDashboard = () => {
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [selectedTimes, setSelectedTimes] = useState({});

    useEffect(() => {
        getAppointments();
    }, []);

    const getAppointments = async () => {
        try {
            const res = await axiosInstance.get('/doctor/doctor-appointments');
            if (res.data.success) {
                setAppointments(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleTimeChange = (appointmentId, value) => {
        setSelectedTimes(prev => ({ ...prev, [appointmentId]: value }));
    };

    const handleStatus = async (appointmentsId, status) => {
        if (status === 'scheduled' && !selectedTimes[appointmentsId]) {
            toast.error('Please select an appointment time before accepting');
            return;
        }
        try {
            const payload = { appointmentsId, status };
            if (status === 'scheduled') {
                payload.appointmentTime = selectedTimes[appointmentsId];
            }
            const res = await axiosInstance.post('/doctor/update-status', payload);
            if (res.data.success) {
                toast.success(res.data.message);
                getAppointments();
                setSelectedTimes(prev => {
                    const copy = { ...prev };
                    delete copy[appointmentsId];
                    return copy;
                });
            }
        } catch (error) {
            toast.error('Update Failed');
        }
    };

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 sm:gap-0">
                <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-dark mb-1 sm:mb-2">Doctor Console</h2>
                    <p className="text-sm sm:text-base text-brand-dark/70">Welcome back, Dr. <span className="text-brand-red">{user?.name}</span></p>
                </div>
                <div className="text-left sm:text-right">
                    <p className="text-xs sm:text-sm text-brand-dark/50">Today's Date</p>
                    <p className="text-base sm:text-xl font-bold text-brand-dark">{new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <div>
                <h4 className="text-lg sm:text-xl font-bold text-brand-dark mb-4 sm:mb-6 border-b border-brand-red/10 pb-2 flex items-center gap-2 sm:gap-3">
                    <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-red" />
                    Pending Appointments
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {appointments.map(app => (
                        <GlassCard key={app._id} className="border-l-4 border-l-brand-red">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h5 className="font-bold text-brand-dark text-lg">{app.userInfo?.name || "Patient"}</h5>
                                    <p className="text-xs text-brand-dark/50">ID: {app._id.slice(-6)}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-bold rounded ${app.status === 'pending' ? 'bg-brand-soft text-brand-dark/70' :
                                    app.status === 'scheduled' ? 'bg-brand-red/10 text-brand-red' : 'bg-brand-dark/10 text-brand-dark'
                                    }`}>
                                    {app.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="space-y-2 mb-6 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-brand-dark/50">Date:</span>
                                    <span className="text-brand-dark">{new Date(app.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-brand-dark/50">Time:</span>
                                    <span className="text-brand-dark">{new Date(app.date).toLocaleTimeString()}</span>
                                </div>
                            </div>

                            {app.status === 'pending' && (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-bold text-brand-dark/70 mb-1">
                                            <ClockIcon className="w-4 h-4 inline mr-1" /> Set Appointment Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className="w-full px-3 py-2 text-sm border border-brand-red/20 rounded-xl focus:outline-none focus:border-brand-red transition-colors bg-white text-brand-dark"
                                            value={selectedTimes[app._id] || ''}
                                            onChange={(e) => handleTimeChange(app._id, e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <NeonButton
                                            className="flex-1 py-2 text-sm bg-none bg-white text-brand-red border border-brand-red hover:bg-brand-soft"
                                            onClick={() => handleStatus(app._id, 'scheduled')}
                                        >
                                            <CheckIcon className="w-4 h-4 mr-1 inline" /> Accept
                                        </NeonButton>
                                        <button
                                            className="flex-1 py-2 text-sm rounded-xl border border-brand-red/20 text-brand-dark/70 hover:bg-brand-offWhite transition-colors flex items-center justify-center font-bold"
                                            onClick={() => handleStatus(app._id, 'cancelled')}
                                        >
                                            <XMarkIcon className="w-4 h-4 mr-1" /> Reject
                                        </button>
                                    </div>
                                </div>
                            )}
                            {app.status === 'scheduled' && (
                                <div className="text-center py-2 text-brand-red bg-brand-red/5 rounded-xl border border-brand-red/10 font-bold">
                                    <CheckIcon className="w-5 h-5 inline mr-2" /> Scheduled
                                    {app.appointmentTime && (
                                        <p className="text-xs text-brand-dark/70 mt-1 font-normal">
                                            {new Date(app.appointmentTime).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            )}
                        </GlassCard>
                    ))}
                    {appointments.length === 0 && (
                        <div className="col-span-full text-center py-12 text-brand-dark/50 italic">
                            No appointments found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
