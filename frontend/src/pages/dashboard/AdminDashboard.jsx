import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { toast } from 'react-toastify';
import GlassCard from '../../components/GlassCard';
import NeonButton from '../../components/NeonButton';
import InputGroup from '../../components/InputGroup';
import {
    CheckCircleIcon, UserIcon, PlusIcon, XMarkIcon,
    DocumentTextIcon, MapPinIcon, CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '',
        specialization: '', experience: '', fees: '',
        address: '', timings: '09:00 - 17:00'
    });
    const [activeTab, setActiveTab] = useState('doctors'); // 'doctors' or 'users'

    useEffect(() => {
        getDoctors();
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const res = await axiosInstance.get('/user/getAllUsers');
            if (res.data.success) {
                setUsers(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const res = await axiosInstance.post('/user/deleteUser', { userId });
                if (res.data.success) {
                    toast.success(res.data.message);
                    getUsers();
                } else {
                    toast.error(res.data.message);
                }
            } catch (error) {
                toast.error('Deletion Failed');
            }
        }
    };

    const getDoctors = async () => {
        try {
            const res = await axiosInstance.get('/doctor/admin/getAllDoctors');
            if (res.data.success) {
                setDoctors(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // ... (rest of the existing functions: handleAccountStatus, handleInputChange, handleAddDoctor)

    const handleAccountStatus = async (doctorId, status) => {
        try {
            const res = await axiosInstance.post('/doctor/admin/changeAccountStatus', { doctorId, status });
            if (res.data.success) {
                toast.success(res.data.message);
                getDoctors();
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'timings') data.append(key, JSON.stringify([formData[key]]));
                else data.append(key, formData[key]);
            });
            if (file) data.append('docImg', file);

            const res = await axiosInstance.post('/doctor/addDoctors', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                toast.success(res.data.message);
                setShowModal(false);
                getDoctors();
                setFormData({
                    name: '', email: '', password: '', phone: '',
                    specialization: '', experience: '', fees: '',
                    address: '', timings: '09:00 - 17:00'
                });
                setFile(null);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to add doctor');
        }
    };

    return (
        <div className="space-y-8 relative">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-brand-dark flex items-center gap-3">
                    <UserIcon className="w-8 h-8 text-brand-red" />
                    <span>Admin Control Center</span>
                </h2>
                <div className="flex gap-4">
                    <div className="bg-brand-offWhite p-1 rounded-xl flex gap-1">
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'doctors' ? 'bg-brand-red text-white shadow-glow-soft' : 'text-brand-dark/70 hover:text-brand-dark'}`}
                            onClick={() => setActiveTab('doctors')}
                        >
                            Doctors
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-brand-red text-white shadow-glow-soft' : 'text-brand-dark/70 hover:text-brand-dark'}`}
                            onClick={() => setActiveTab('users')}
                        >
                            Users
                        </button>
                    </div>
                    {activeTab === 'doctors' && (
                        <NeonButton variant="primary" onClick={() => setShowModal(true)} className="flex items-center gap-2">
                            <PlusIcon className="w-5 h-5" /> Add New Doctor
                        </NeonButton>
                    )}
                </div>
            </div>

            {activeTab === 'doctors' ? (
                <div>
                    <h4 className="text-xl font-bold text-brand-dark mb-6 border-b border-brand-red/10 pb-2">Doctor Verifications</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map(doc => (
                            <GlassCard key={doc._id} className="relative overflow-hidden group hover:shadow-glow-soft transition-all duration-300">
                                <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl
                                    ${doc.status === 'pending' ? 'bg-brand-soft text-brand-dark/70' :
                                        doc.status === 'approved' ? 'bg-brand-red/10 text-brand-red' : 'bg-brand-dark/10 text-brand-dark'}
                                `}>
                                    {doc.status.toUpperCase()}
                                </div>

                                <div className="flex items-center gap-4 mb-4 mt-2">
                                    <div className="w-12 h-12 bg-white border border-brand-red/20 rounded-full flex items-center justify-center text-xl font-bold text-brand-red uppercase shadow-sm">
                                        {doc.fullname?.[0] || 'D'}
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-brand-dark text-lg">{doc.fullname}</h5>
                                        <p className="text-sm text-brand-red font-medium">{doc.specialization}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 border-t border-gray-100 pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-brand-dark/50">Experience</span>
                                        <span className="text-brand-dark">{doc.experience} Years</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-brand-dark/50">Fees</span>
                                        <span className="text-brand-dark flex items-center gap-1">
                                            <CurrencyDollarIcon className="w-4 h-4" /> {doc.fees}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-brand-dark/50">Location</span>
                                        <span className="text-brand-dark flex items-center gap-1">
                                            <MapPinIcon className="w-4 h-4" /> {doc.address}
                                        </span>
                                    </div>

                                    {doc.documents && (
                                        <a
                                            href={`http://localhost:5000/${doc.documents}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full py-2 text-center text-xs font-bold text-brand-red bg-brand-red/5 rounded-lg hover:bg-brand-red/10 transition-colors"
                                        >
                                            <DocumentTextIcon className="w-4 h-4 inline mr-1" /> View Verification Doc
                                        </a>
                                    )}

                                    {doc.status === 'pending' && (
                                        <NeonButton
                                            className="w-full mt-2 flex items-center justify-center gap-2"
                                            onClick={() => handleAccountStatus(doc._id, 'approved')}
                                        >
                                            <CheckCircleIcon className="w-5 h-5" />
                                            Approve Request
                                        </NeonButton>
                                    )}
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <h4 className="text-xl font-bold text-brand-dark mb-6 border-b border-brand-red/10 pb-2">Registered Users</h4>
                    <div className="overflow-x-auto bg-white rounded-xl border border-brand-red/10 shadow-sm">
                        <table className="w-full text-left text-brand-dark">
                            <thead className="text-xs uppercase bg-brand-offWhite text-brand-dark/60">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} className="border-b border-brand-red/5 hover:bg-brand-offWhite transition-colors">
                                        <td className="px-6 py-4 font-bold text-brand-dark">{user.name}</td>
                                        <td className="px-6 py-4 text-brand-dark/80">{user.email}</td>
                                        <td className="px-6 py-4 capitalize text-brand-dark/80">{user.isDoctor ? 'Doctor (Pending)' : 'Patient'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="text-brand-red hover:text-brand-light hover:bg-brand-soft px-3 py-1 rounded-lg transition-colors text-sm font-bold"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-8 text-brand-dark/50">No users found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Doctor Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-fadeIn">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-brand-dark/40 hover:text-brand-dark"
                        >
                            <XMarkIcon className="w-8 h-8" />
                        </button>

                        <h3 className="text-2xl font-bold text-brand-dark mb-6">Add New Doctor</h3>

                        <form onSubmit={handleAddDoctor} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputGroup label="Full Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Dr. Name" required />
                                <InputGroup label="Email" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required />
                                <InputGroup label="Phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" required />
                                <InputGroup label="Password" type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" required />
                                <InputGroup label="Specialization" name="specialization" value={formData.specialization} onChange={handleInputChange} placeholder="Specialization" required />
                                <InputGroup label="Experience" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="Experience" required />
                                <InputGroup label="Fees" type="number" name="fees" value={formData.fees} onChange={handleInputChange} placeholder="Fees" required />
                                <InputGroup label="Timings" name="timings" value={formData.timings} onChange={handleInputChange} placeholder="09:00 - 17:00" required />
                            </div>
                            <InputGroup label="Clinic Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Address" required />

                            <div>
                                <label className="block text-brand-dark/70 text-sm font-bold mb-2">Upload Document</label>
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    className="w-full px-4 py-2 rounded-xl bg-brand-offWhite border border-brand-red/20 text-brand-dark focus:border-brand-red"
                                />
                            </div>

                            <NeonButton type="submit" className="w-full mt-4">Create Doctor Profile</NeonButton>
                        </form>
                    </GlassCard>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
