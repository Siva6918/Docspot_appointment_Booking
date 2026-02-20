import React, { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const GoogleLoginButton = ({ text = "signin_with" }) => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID") {
        return null;
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await axiosInstance.post('/user/google-login', {
                token: credentialResponse.credential
            });
            if (res.data.success) {
                login(res.data);
                toast.success(res.data.message);

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
            console.error(error);
            toast.error("Google Auth Failed");
        }
    };

    return (
        <div className="w-full flex justify-center mt-4">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                    toast.error('Login Failed');
                }}
                theme="filled_black"
                shape="pill"
                text={text}
                width="350px"
            />
        </div>
    );
};

export default GoogleLoginButton;
