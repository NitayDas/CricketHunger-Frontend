import React, { useContext, useState } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import { FaUserCircle, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [validations, setValidations] = useState({
        hasCapital: false,
        hasSpecialChar: false,
        hasDigit: false,
        minLength: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        setError('');

        setValidations({
            hasCapital: /[A-Z]/.test(value),
            hasSpecialChar: /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(value),
            hasDigit: /[0-9]/.test(value),
            minLength: value.length >= 6,
        });
    };
    console.log(user);

    const togglePasswordVisibility = (field) => {
        setPasswordVisible(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const resetForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
    };

    const closeModal = () => {
        resetForm();
        document.getElementById('password_modal').close();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        if (newPassword !== confirmPassword) {
            setError("New passwords don't match");
            setLoading(false);
            return;
        }
    
        if (!Object.values(validations).every(Boolean)) {
            setError("Please ensure the password meets all requirements");
            setLoading(false);
            return;
        }
    
        try {
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
    
            toast.success("Password updated successfully!");
            closeModal();
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                setError("Current password is incorrect");
            } else if (error.code === 'auth/weak-password') {
                setError("Password is too weak");
            } else {
                setError(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="p-8">
                    <div className="flex flex-col items-center">
                        {user?.photoURL ? (
                            <img
                                className="h-32 w-32 rounded-full object-cover mb-4"
                                src={user.photoURL}
                                alt="Profile"
                            />
                        ) : (
                            <FaUserCircle className="h-32 w-32 text-gray-400 mb-4" />
                        )}

                        <div className="text-center w-full">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {user?.displayName || 'No username set'}
                            </h2>
                            <p className="text-gray-600 mb-6">
                                {user?.email}
                            </p>

                            <div className="grid grid-cols-1 gap-4 mb-8">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-gray-700">Account Created</h3>
                                    <p className="text-gray-500">
                                        {user?.metadata?.creationTime &&
                                            new Date(user.metadata.creationTime).toLocaleDateString()
                                        }
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-gray-700">Last Sign In</h3>
                                    <p className="text-gray-500">
                                        {user?.metadata?.lastSignInTime &&
                                            new Date(user.metadata.lastSignInTime).toLocaleString()
                                        }
                                    </p>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary w-full flex items-center justify-center gap-2"
                                onClick={() => document.getElementById('password_modal').showModal()}
                            >
                                <FaLock /> Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <dialog id="password_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Change Password</h3>
                    
                    {error && (
                        <div className="alert alert-error mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 mt-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Current Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={passwordVisible.current ? "text" : "password"}
                                        className="input input-bordered w-full"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('current')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        {passwordVisible.current ? <FaEye /> : <FaEyeSlash />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">New Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={passwordVisible.new ? "text" : "password"}
                                        className="input input-bordered w-full"
                                        value={newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        {passwordVisible.new ? <FaEye /> : <FaEyeSlash />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Confirm New Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={passwordVisible.confirm ? "text" : "password"}
                                        className="input input-bordered w-full"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        {passwordVisible.confirm ? <FaEye /> : <FaEyeSlash />}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="text-sm font-medium mb-2">Password Requirements:</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-xs"
                                            checked={validations.minLength}
                                            readOnly
                                        />
                                        <span className="ml-2 text-sm">6+ characters</span>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-xs"
                                            checked={validations.hasCapital}
                                            readOnly
                                        />
                                        <span className="ml-2 text-sm">Capital letter</span>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-xs"
                                            checked={validations.hasSpecialChar}
                                            readOnly
                                        />
                                        <span className="ml-2 text-sm">Special character</span>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-xs"
                                            checked={validations.hasDigit}
                                            readOnly
                                        />
                                        <span className="ml-2 text-sm">Number</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-action">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>

                            <button
                                type="button"
                                className="btn"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default Profile;