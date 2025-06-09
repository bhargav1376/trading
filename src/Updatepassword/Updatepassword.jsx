import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Updatepassword.css';
import updatepassword_preview from './images/updatepassword_preview.png';

const Updatepassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('error');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { email, otp } = location.state || {};

    useEffect(() => {
        document.title = 'Trading | Update Password';
        
        if (!email || !otp) {
            navigate('/forgot-password');
        }
    }, [email, otp, navigate]);

    const validatePassword = (password) => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password must include one uppercase letter';
        }
        if (!/\d/.test(password)) {
            return 'Password must include one number';
        }
        if (!/[!@#$%^&*]/.test(password)) {
            return 'Password must include one special character (!@#$%^&*)';
        }
        return '';
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setNewPassword(password);
        setPasswordError(validatePassword(password));
    };

    const togglePasswordVisibility = (field) => {
        if (field === 'new') {
            setShowNewPassword(!showNewPassword);
            setTimeout(() => setShowNewPassword(false), 4000);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
            setTimeout(() => setShowConfirmPassword(false), 4000);
        }
    };

    const showPopupMessage = (msg, type = 'error') => {
        setPopupMessage(msg);
        setPopupType(type);
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
        }, 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (newPassword !== confirmPassword) {
            showPopupMessage('Passwords do not match', 'error');
            setLoading(false);
            return;
        }

        if (passwordError) {
            showPopupMessage(passwordError, 'error');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3030/api/update-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    otp,
                    newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                showPopupMessage('Password updated successfully!', 'success');
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            } else {
                showPopupMessage(data.error || 'Failed to update password', 'error');
            }
        } catch (error) {
            showPopupMessage('An error occurred. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="update-password-image">
            {showPopup && (
                <div className={`popup-message-update ${popupType}`}>
                    {popupMessage}
                </div>
            )}
            <div className="update-password-container">
                <div className="update-password-box">
                    <div className="update-password-preview">
                        <img className='update-password-preview-image' src="./images/update-password.jpg" alt="Password Update Preview" />
                    </div>
                    <div className="update-password-content">
                        <h2 className="update-password-title">Create New Password</h2>
                        <p className="update-password-info">
                            Please enter your new password below. Make sure it's strong and secure.
                        </p>
                        
                        <form onSubmit={handleSubmit} className="update-password-form">
                            <div className="password-inputs-update">
                                <div className="password-input-group">
                                    <label htmlFor="newPassword">New Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            id="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            minLength="8"
                                            placeholder="Enter new password"
                                            className={`update-password-input ${passwordError ? 'update-password-input-error' : ''}`}
                                        />
                                        <i
                                            className={`fa ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
                                            onClick={() => togglePasswordVisibility('new')}
                                        ></i>
                                    </div>
                                    {passwordError && <p className="update-password-error-text">{passwordError}</p>}
                                </div>
                                <div className="password-input-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            minLength="8"
                                            placeholder="Confirm new password"
                                            className={`update-password-input ${newPassword !== confirmPassword && confirmPassword ? 'update-password-input-error' : ''}`}
                                        />
                                        <i
                                            className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
                                            onClick={() => togglePasswordVisibility('confirm')}
                                        ></i>
                                    </div>
                                    {newPassword !== confirmPassword && confirmPassword && (
                                        <p className="update-password-error-text">Passwords do not match</p>
                                    )}
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="update-password-button"
                                disabled={loading || !!passwordError || newPassword !== confirmPassword}
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Updatepassword; 