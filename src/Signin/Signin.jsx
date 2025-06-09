import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Signin.css';
import signinImage from './images/log.jpg';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:3030';
axios.defaults.withCredentials = true;

const Signin = () => {

    useEffect(() => {
        document.title = 'Trading | Signin';
    }, []);

    const [formData, setFormData] = useState({
        userId: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        userId: '',
        password: '',
        submit: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Function to show error popup
    const showError = (message) => {
        setErrorMessage(message);
        setShowErrorPopup(true);
        setTimeout(() => {
            setShowErrorPopup(false);
        }, 4000);
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Validate email/phone input characters
        if (name === 'userId') {
            const validChars = /^[a-zA-Z0-9@._\-+()\s]+$/;
            if (value && !validChars.test(value)) {
                showError('Invalid character. Please use only letters, numbers, and the following characters: @, ., _, -, +, (), and space');
                setErrors(prev => ({ ...prev, userId: 'error' }));
                return;
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        // Auto hide after 4 seconds
        setTimeout(() => setShowPassword(false), 4000);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors(prev => ({ ...prev, submit: '', userId: '', password: '' }));

        try {
            const response = await axios.post('/api/login', formData);
            
            if (response.data.success) {
                // Store user data in session storage with the correct key
                sessionStorage.setItem('userData', JSON.stringify(response.data.user));
                
                // Redirect based on admin status
                if (response.data.user.isAdmin) {
                    window.location.href = '/admin';
                } else {
                    window.location.href = '/homepage';
                }
            }
        } catch (error) {
            if (error.response) {
                // Server responded with an error
                const errorType = error.response.data.errorType;
                const errorMessage = error.response.data.message;

                if (errorType === 'userNotFound') {
                    showError('Invalid username, email, or phone number');
                    setErrors(prev => ({ ...prev, userId: 'error' }));
                } else if (errorType === 'invalidPassword') {
                    showError('Invalid password');
                    setErrors(prev => ({ ...prev, password: 'error' }));
                } else {
                    showError(errorMessage || 'Login failed. Please try again.');
                }
            } else {
                // Network error or other issues
                showError('Network error. Please check your connection and try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="Login Pages">
            {showErrorPopup && (
                <div className="error-popup">
                    {errorMessage}
                </div>
            )}
            <div className="Login-p Form">
                <div className="Image_Tag">
                    {/* Add your logo here if needed */}
                </div>
            </div>
            <div className="Login_page">
                <div className="Login_details">
                    <div className="Details_form_logins">
                        <div className="Login_from_flex">
                            <div className="Move_circle_1"></div>
                            <div className="div_flex">
                                <div className="Submit_Form-login">
                                    <div className="Name_Flex">
                                        <div className="Name_Tag">
                                            <h1 className="Name_Tag">Sign in</h1>
                                        </div>
                                        
                                        <form className="Details_submit" onSubmit={handleSubmit}>
                                            <div className="Input_name">
                                                <label className="Label_Type">Email or Phone Number</label>
                                                <input
                                                    type="text"
                                                    name="userId"
                                                    id='uid'
                                                    value={formData.userId}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Email or Phone Number"
                                                    required
                                                    autoFocus
                                                    className={errors.userId ? 'error' : ''}
                                                />
                                            </div>

                                            <div className="Input_name password-re">
                                                <label className="Label_Type">Password</label>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    id='spass'
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Password"
                                                    required
                                                    className={errors.password ? 'error' : ''}
                                                />
                                                <div className="right-sidr">
                                                    <div className="user-right">
                                                        <i
                                                            className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                                                            onClick={togglePasswordVisibility}
                                                        ></i>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="Rem_me">
                                                <div className="Rem">
                                                    <input
                                                        type="checkbox"
                                                        checked={rememberMe}
                                                        onChange={(e) => setRememberMe(e.target.checked)}
                                                    />
                                                    <p className="Remember">Remember Me</p>
                                                </div>
                                                <div className="Forgot_pass">
                                                    <Link className="Forgot_page" to="/forgot-password">Forgot Password</Link>
                                                </div>
                                            </div>

                                            <button 
                                                className="Btn_submit" 
                                                type="submit"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? 'Logging in...' : 'Login'}
                                            </button>
                                            <div className="Account_already">
                                                Doesn't have an account yet? <a className="Login_Page" href="./signup">Sign Up</a>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="img_src-lo">
                                    <div className="img-tr">
                                        <img className="img-src-login" src="./images/log.jpg" alt="Trading" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signin;
