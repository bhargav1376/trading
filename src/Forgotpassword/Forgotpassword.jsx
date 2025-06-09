import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Forgotpassword.css';
import forgotImage from './images/forpas.webp';

const Forgotpassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [emailError, setEmailError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
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
                setMessage({ text: 'OTP has been sent to your email!', type: 'success' });
                setEmailError(false);
                setTimeout(() => {
                    setMessage({ text: '', type: '' });
                    navigate('/otp', { state: { email } });
                }, 2000);
            } else {
                setMessage({ text: data.error || 'Failed to send OTP', type: 'error' });
                setEmailError(true); 
            // Auto-close after 4 seconds
                setTimeout(() => {
                    setMessage({ text: '', type: '' });
                }, 2000);
            }
        } catch (error) {
            setMessage({ text: 'An error occurred. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="Signup Form">
            {message.text && (
                <div 
                    className="popup-message" 
                    style={{
                        position: 'fixed',
                        top: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        backgroundColor: message.type === 'success' ? '#4CAF50' : '#f44336',
                        color: 'white',
                        zIndex: 1000,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                >
                    {message.text}
                </div>
            )}
            <div className="Image_Tag">
                {/* Add your logo here if needed */}
            </div>
            <div className="Signup_page">
                <div className="Signup_details">
                    <div className="Details_form">
                        <div className="Signup_from_flex">
                            <div className="Image_Signup">
                                {/* Add any additional images here */}
                            </div>
                            <div className="Submit_Form">
                                <div className="Img_src">
                                    <div className="gap_m">
                                        {/* Add any header content here */}
                                    </div>
                                    <img className="img-src-Forgot" src="./images/forgot.jpg" alt="Forgot Password" />
                                </div>

                                <div className="Name_Flex">
                                    <div className="Name_Tag">
                                        <h1 className="Name_Tag">Forgot Password</h1>
                                    </div>

                                    {error && (
                                        <div className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
                                            {error}
                                        </div>
                                    )}

                                    <form className="Details_submit" onSubmit={handleSubmit}>
                                        <div className="Input_name">
                                            <div className="Label_text">
                                                <label className="Label_Type">Email</label>
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                id='forgemail'
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter Email"
                                                required
                                                className={emailError ? 'forgoterror' : ''}
                                            />
                                            <div className="user-en">
                                                {/* Add email icon if needed */}
                                            </div>
                                        </div>

                                        <button 
                                            className="Btn_submit" 
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? 'Sending...' : 'Send OTP'}
                                        </button>
                                        <div className="Account_already">
                                            <a className="Login_Page" href="./signin">Back To Login</a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forgotpassword;
