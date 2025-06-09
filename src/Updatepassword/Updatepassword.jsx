import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Updatepassword.css';

const Updatepassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('error');

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return 'Password must be at least 8 characters long and include one uppercase letter, one number, and one special character';
        }
        return '';
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        if (name === 'newPassword') {
            setNewPassword(value);
            setPasswordError(validatePassword(value));
        } else {
            setConfirmPassword(value);
        }
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

        // Mock password update
        setTimeout(() => {
            if (newPassword !== confirmPassword) {
                showPopupMessage('Passwords do not match');
            } else if (passwordError) {
                showPopupMessage(passwordError);
            } else {
                // Mock successful password update
                showPopupMessage('Password updated successfully!', 'success');
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="update-password-container">
            {showPopup && (
                <div className={`popup-message ${popupType}`}>
                    {popupMessage}
                </div>
            )}
            <div className="update-password-box">
                <div className="update-password-preview">
                    <img className='update-password-preview-image' src="./images/update-password.jpg" alt="Password Update Preview" />
                </div>
                <div className="update-password-content">
                    <h2>Update Password</h2>
                    <p>Please enter your new password below.</p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="password-input-group">
                            <label>New Password</label>
                            <div className="password-input-container">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    value={newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter new password"
                                    required
                                />
                                <i
                                    className={`fa ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
                                    onClick={() => togglePasswordVisibility('new')}
                                ></i>
                            </div>
                        </div>

                        <div className="password-input-group">
                            <label>Confirm Password</label>
                            <div className="password-input-container">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Confirm new password"
                                    required
                                />
                                <i
                                    className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
                                    onClick={() => togglePasswordVisibility('confirm')}
                                ></i>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="Btn_submit-update"
                            onClick={handleSubmit}
                            disabled={loading || !!passwordError || newPassword !== confirmPassword}
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Updatepassword; 