import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Forgotpassword.css';

const Forgotpassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Mock email validation
    const mockEmails = ['user@example.com', 'admin@example.com'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Mock email validation
        setTimeout(() => {
            if (!mockEmails.includes(email)) {
                setError('Email not found. Please check your email address.');
            } else {
                // Mock successful email verification
                navigate('/otp', { state: { email } });
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="Forgotpassword">
            <div className="Forgotpassword_box">
                <div className="Forgotpassword_content">
                    <h2>Forgot Password</h2>
                    <p>Enter your email address and we'll send you a link to reset your password.</p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        
                        {error && <div className="error-message">{error}</div>}
                        
                        <button 
                            type="submit" 
                            className="Btn_submit-forgot"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                        
                        <div className="Account_already">
                            <a className="Login_Page" href="./signin">Back To Login</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Forgotpassword;
