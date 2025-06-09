import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Signupotp.css';

const Signupotp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState(['', '', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('error'); // 'error' or 'success'
    const [otpError, setOtpError] = useState(false);
    const [timer, setTimer] = useState(() => {
        // Get stored timer value and start time
        const storedTimer = localStorage.getItem('otpTimer');
        const storedTime = localStorage.getItem('otpStartTime');
        
        if (storedTimer && storedTime) {
            const startTime = parseInt(storedTime);
            const currentTime = Date.now();
            const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
            const remainingSeconds = Math.max(0, parseInt(storedTimer) - elapsedSeconds);
            
            // If timer has expired, clear storage
            if (remainingSeconds <= 0) {
                localStorage.removeItem('otpTimer');
                localStorage.removeItem('otpStartTime');
                return 0;
            }
            
            return remainingSeconds;
        }
        return 300; // Default 5 minutes
    });
    const [formData, setFormData] = useState(null);
    const inputRefs = useRef([]);

    // Function to show popup message
    const showPopupMessage = (msg, type = 'error') => {
        setPopupMessage(msg);
        setPopupType(type);
        setShowPopup(true);
        // Auto hide popup after 3 seconds
        setTimeout(() => {
            setShowPopup(false);
        }, 3000);
    };

    useEffect(() => {
        // Set page title
        document.title = 'Trading | Signup OTP Verification';

        // Get form data from location state
        if (location.state?.formData) {
            setFormData(location.state.formData);
        } else {
            // If no form data, redirect back to signup
            navigate('/signup');
        }

        // Store initial timer value if not already stored
        if (!localStorage.getItem('otpTimer')) {
            const startTime = Date.now();
            localStorage.setItem('otpTimer', '300');
            localStorage.setItem('otpStartTime', startTime.toString());
        }

        // Start timer with precise timing
        const startTime = parseInt(localStorage.getItem('otpStartTime'));
        const updateTimer = () => {
            const currentTime = Date.now();
            const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
            const remainingSeconds = Math.max(0, 300 - elapsedSeconds);

            if (remainingSeconds <= 0) {
                clearInterval(window.otpInterval);
                localStorage.removeItem('otpTimer');
                localStorage.removeItem('otpStartTime');
                showPopupMessage('OTP has expired. Please request a new one.', 'error');
                setTimer(0);
                return;
            }

            setTimer(remainingSeconds);
            localStorage.setItem('otpTimer', remainingSeconds.toString());
        };

        // Update timer immediately
        updateTimer();

        // Then update every second
        window.otpInterval = setInterval(updateTimer, 1000);

        return () => {
            if (window.otpInterval) {
                clearInterval(window.otpInterval);
            }
        };
    }, [navigate, location]);

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setOtpError(false); // Reset error state when user types

        if (value && index < 6) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 7);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setOtpError(false); // Reset error state

        const otpString = otp.join('');

        try {
            const response = await fetch('http://localhost:3030/api/verify-signup-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    otp: otpString,
                    formData: formData
                }),
            });

            const data = await response.json();

            if (response.ok) {
                showPopupMessage('OTP verified successfully! Redirecting to login...', 'success');
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            } else {
                setOtpError(true); // Set error state
                showPopupMessage(data.error || 'Invalid OTP. Please try again.', 'error');
            }
        } catch (error) {
            setOtpError(true); // Set error state
            showPopupMessage('An error occurred. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3030/api/resend-signup-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email
                }),
            });

            const data = await response.json();

            if (response.ok) {
                showPopupMessage('New OTP sent successfully!', 'success');
                
                // Clear existing interval
                if (window.otpInterval) {
                    clearInterval(window.otpInterval);
                }

                // Reset timer with new start time
                const startTime = Date.now();
                localStorage.setItem('otpTimer', '300');
                localStorage.setItem('otpStartTime', startTime.toString());
                setTimer(300);

                // Start new timer with precise timing
                const updateTimer = () => {
                    const currentTime = Date.now();
                    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
                    const remainingSeconds = Math.max(0, 300 - elapsedSeconds);

                    if (remainingSeconds <= 0) {
                        clearInterval(window.otpInterval);
                        localStorage.removeItem('otpTimer');
                        localStorage.removeItem('otpStartTime');
                        showPopupMessage('OTP has expired. Please request a new one.', 'error');
                        setTimer(0);
                        return;
                    }

                    setTimer(remainingSeconds);
                    localStorage.setItem('otpTimer', remainingSeconds.toString());
                };

                // Update timer immediately
                updateTimer();

                // Then update every second
                window.otpInterval = setInterval(updateTimer, 1000);
            } else {
                showPopupMessage(data.error || 'Failed to resend OTP. Please try again.', 'error');
            }
        } catch (error) {
            showPopupMessage('An error occurred. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="Signupotp_image">
            {showPopup && (
                <div className={`popup-message-signupotp ${popupType}`}>
                    {popupMessage}
                </div>
            )}
            <div className="otp-container-signupotp">
                <div className="otp-box-signupotp">
                    <h2 className='Email_ver'>Email Verification</h2>
                    <p className="otp-info">
                        Please enter the 7-digit verification code sent to your email address.
                    </p>
                    <p className="spam-note">
                        Note: If you don't see the email, please check your spam folder.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="otp-input-container-signupotp">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => inputRefs.current[index] = el}
                                    type="text"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    maxLength={1}
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                    required
                                    className={`otp-input ${otpError ? 'error' : ''}`}
                                />
                            ))}
                        </div>

                        <div className="timer-section">
                            {timer > 0 ? (
                                `Time remaining: ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={loading}
                                    className="resend-text"
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>

                        <button type="submit" className='Btn_submit-signupotp' disabled={loading || otp.some(digit => !digit)}>
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signupotp; 