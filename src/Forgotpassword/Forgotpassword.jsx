import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Forgotpassword.css';

const Forgotpassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [emailError, setEmailError] = useState(false);

    // Mock email validation
    const mockEmails = ['user@example.com', 'admin@example.com'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setEmailError(false);

        // Mock email validation
        setTimeout(() => {
            if (!mockEmails.includes(email)) {
                setError('Email not found. Please check your email address.');
                setEmailError(true);
            } else {
                // Mock successful email verification
                setMessage({ text: 'OTP sent successfully!', type: 'success' });
                navigate('/otp', { state: { email } });
            }
            setLoading(false);
        }, 1000);
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
                                    <img className="img-src-Forgot" src="https://bhargav1376.github.io/trading/Images/forpas.webp" alt="Forgot Password" />
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
                                            <Link className="Login_Page" to="/signin">Back To Login</Link>
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
