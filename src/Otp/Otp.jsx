import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Otp.css';

const Otp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState(['', '', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('error');
    const [otpError, setOtpError] = useState(false);
    const [timeLeft, setTimeLeft] = useState(() => {
        const storedTimer = localStorage.getItem('otpTimer');
        const storedTime = localStorage.getItem('otpStartTime');
        
        if (storedTimer && storedTime) {
            const startTime = parseInt(storedTime);
            const currentTime = Date.now();
            const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
            const remainingSeconds = Math.max(0, parseInt(storedTimer) - elapsedSeconds);
            
            if (remainingSeconds <= 0) {
                localStorage.removeItem('otpTimer');
                localStorage.removeItem('otpStartTime');
                return 0;
            }
            
            return remainingSeconds;
        }
        return 300;
    });
    const email = location.state?.email;
    const inputRefs = useRef([]);

    // Function to show popup message
    const showPopupMessage = (msg, type = 'error') => {
        setPopupMessage(msg);
        setPopupType(type);
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
        }, 3000);
    };

    useEffect(() => {
        document.title = 'Trading | OTP Verification';

        if (!email) {
            navigate('/forgot-password');
            return;
        }

        if (!localStorage.getItem('otpTimer')) {
            const startTime = Date.now();
            localStorage.setItem('otpTimer', '300');
            localStorage.setItem('otpStartTime', startTime.toString());
        }

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
                setTimeLeft(0);
                setOtpError(true);
                return;
            }

            setTimeLeft(remainingSeconds);
            localStorage.setItem('otpTimer', remainingSeconds.toString());
        };

        updateTimer();
        window.otpInterval = setInterval(updateTimer, 1000);

        return () => {
            if (window.otpInterval) {
                clearInterval(window.otpInterval);
            }
        };
    }, [email, navigate]);

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setOtpError(false);

        if (value && index < 6) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
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
        setMessage({ text: '', type: '' });
        setOtpError(false);

        const otpString = otp.join('');

        try {
            const response = await fetch('http://localhost:3030/api/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    otp: otpString
                })
            });

            const data = await response.json();

            if (response.ok) {
                showPopupMessage('OTP verified successfully!', 'success');
                setTimeout(() => {
                    navigate('/update-password', { state: { email, otp: otpString } });
                }, 1000);
            } else {
                setOtpError(true);
                showPopupMessage(data.error || 'Invalid OTP', 'error');
            }
        } catch (error) {
            setOtpError(true);
            showPopupMessage('An error occurred. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await fetch('http://localhost:3030/api/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                showPopupMessage('New OTP sent successfully!', 'success');
                
                if (window.otpInterval) {
                    clearInterval(window.otpInterval);
                }

                const startTime = Date.now();
                localStorage.setItem('otpTimer', '300');
                localStorage.setItem('otpStartTime', startTime.toString());
                setTimeLeft(300);

                const updateTimer = () => {
                    const currentTime = Date.now();
                    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
                    const remainingSeconds = Math.max(0, 300 - elapsedSeconds);

                    if (remainingSeconds <= 0) {
                        clearInterval(window.otpInterval);
                        localStorage.removeItem('otpTimer');
                        localStorage.removeItem('otpStartTime');
                        showPopupMessage('OTP has expired. Please request a new one.', 'error');
                        setTimeLeft(0);
                        return;
                    }

                    setTimeLeft(remainingSeconds);
                    localStorage.setItem('otpTimer', remainingSeconds.toString());
                };

                updateTimer();
                window.otpInterval = setInterval(updateTimer, 1000);
            } else {
                showPopupMessage(data.error || 'Failed to send OTP', 'error');
            }
        } catch (error) {
            showPopupMessage('An error occurred. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="Signupotp_image-otp">
            {showPopup && (
                <div className={`popup-message-signupotp ${popupType}`}>
                    {popupMessage}
                </div>
            )}
            <div className="otp-container-signupotp">
                <div className="otp-box-signupotp">
                    <h2 className='otp-verification-title'>Password Reset Verification</h2>
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
                                    className={`otp-input-otp ${otpError ? 'error' : ''}`}
                                />
                            ))}
                        </div>

                        <div className="timer-section">
                            {timeLeft > 0 ? (
                                `Time remaining: ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
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

                        <button 
                            type="submit" 
                            className='Btn_submit-signupotp' 
                            disabled={loading || otp.some(digit => !digit)}
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Otp; 