import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';
import signupImage from './images/sig.webp';
import axios from 'axios';

const Signup = () => {
    const navigate = useNavigate();
    
    // Set page title
    useEffect(() => {
        document.title = 'Trading | Signup';
    }, []);

    // State for form fields
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        tradingViewId: '',
        password: '',
        repeatPassword: '',
        referralId: '',
        referral_id: '' // This will be auto-generated
    });

    // Add loading state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State for errors
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        phone: '',
        tradingViewId: '',
        password: '',
        repeatPassword: '',
        referralId: '',
        submit: ''
    });

    // State for password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [showReferral, setShowReferral] = useState(false);

    // Validation patterns
    const patterns = {
        username: /^[a-zA-Z]{3,}$/,  // Only letters, minimum 3 characters
        email: /^[^\s@]+@[^\s@]+\.(com|in|co)$/,  // Email must end with .com, .in, or .co
        phone: /^[6-9]\d{9}$/,  // Must start with 6,7,8,9 and be exactly 10 digits
        password: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,  // At least 8 chars, 1 uppercase, 1 number, 1 special char
        referralId: /^ATS[a-zA-Z0-9]{5}$/  // Must start with ATS (case-insensitive) followed by 3 alphanumeric characters
    };

    // Add debounce function for email check
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Check email availability
    const checkEmailAvailability = async (email) => {
        if (!email || !patterns.email.test(email)) return;
        
        try {
            const response = await fetch(`http://localhost:3030/api/check-email?email=${encodeURIComponent(email)}`);
            if (!response.ok) {
                setErrors(prev => ({
                    ...prev,
                    email: 'This email is already registered'
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    email: ''
                }));
            }
        } catch (error) {
            console.error('Error checking email:', error);
        }
    };

    // Check TradingView ID availability
    const checkTradingViewIdAvailability = async (tradingViewId) => {
        if (!tradingViewId || !/^[a-zA-Z0-9_]+$/.test(tradingViewId)) return;
        
        try {
            const response = await fetch(`http://localhost:3030/api/check-tradingview-id?tradingViewId=${encodeURIComponent(tradingViewId)}`);
            if (!response.ok) {
                setErrors(prev => ({
                    ...prev,
                    tradingViewId: 'This TradingView ID is already registered'
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    tradingViewId: ''
                }));
            }
        } catch (error) {
            console.error('Error checking TradingView ID:', error);
        }
    };

    // Debounced checks
    const debouncedEmailCheck = debounce(checkEmailAvailability, 500);
    const debouncedTradingViewIdCheck = debounce(checkTradingViewIdAvailability, 500);

    // Handle input changes with immediate validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Auto-capitalize letters for referral ID
        let processedValue = value;
        if (name === 'referralId') {
            processedValue = value.toUpperCase();
        }
        
        setFormData(prevState => ({
            ...prevState,
            [name]: processedValue
        }));

        // Immediate validation
        validateField(name, processedValue);
        
        // Check email availability when email field changes
        if (name === 'email' && patterns.email.test(value)) {
            debouncedEmailCheck(value);
        }

        // Check TradingView ID availability when tradingViewId field changes
        if (name === 'tradingViewId' && /^[a-zA-Z0-9_]+$/.test(value)) {
            debouncedTradingViewIdCheck(value);
        }
    };

    // Validate individual field
    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'username':
                if (!value) {
                    error = 'Username is required';
                } else if (value.includes(' ')) {
                    error = 'Username cannot contain spaces';
                } else if (!patterns.username.test(value)) {
                    if (value.length < 3) {
                        error = 'Username must be at least 3 characters long';
                    } else if (/[0-9]/.test(value)) {
                        error = 'Username cannot contain numbers';
                    } else {
                        error = 'Username can only contain letters';
                    }
                }
                break;

            case 'email':
                if (!value) {
                    error = 'Email is required';
                } else if (!patterns.email.test(value)) {
                    error = 'Email must be valid and end with .com, .in, or .co';
                }
                break;

            case 'phone':
                if (!value) {
                    error = 'Phone number is required';
                } else if (!patterns.phone.test(value)) {
                    error = 'Phone number must start with 6,7,8,9 and be exactly 10 digits';
                }
                break;

            case 'password':
                if (!value) {
                    error = 'Password is required';
                } else if (!patterns.password.test(value)) {
                    error = 'Password must be at least 8 characters long and include one uppercase letter, one number, and one special character';
                }
                break;

            case 'repeatPassword':
                if (!value) {
                    error = 'Please confirm your password';
                } else if (value !== formData.password) {
                    error = 'Passwords do not match';
                }
                break;

            case 'tradingViewId':
                if (!value) {
                    error = 'Trading View ID is required';
                } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                    error = 'Trading View ID can only contain letters, numbers, and underscores';
                }
                break;

            case 'referralId':
                if (showReferral && value) {
                    if (!value.toUpperCase().startsWith('ATS')) {
                       // error = 'Referral ID must start with ATS';
                       error = 'Enter a valid Referral ID';
                    } else if (!patterns.referralId.test(value)) {
                        //error = 'Referral ID must be exactly 8 characters (ATS followed by 3 Numbers)';
                        error = 'Enter a valid Referral ID';
                    }
                }
                break;

            default:
                break;
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));

        return !error;
    };

    // Validate form
    const validateForm = () => {
        let isValid = true;
        
        // Validate all fields
        Object.keys(formData).forEach(key => {
            if (!validateField(key, formData[key])) {
                isValid = false;
            }
        });

        return isValid;
    };

    // Toggle password visibility
    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
            // Auto hide after 4 seconds
            setTimeout(() => setShowPassword(false), 4000);
        } else {
            setShowRepeatPassword(!showRepeatPassword);
            // Auto hide after 4 seconds
            setTimeout(() => setShowRepeatPassword(false), 4000);
        }
    };

    // Toggle referral field visibility
    const toggleReferral = () => {
        setShowReferral(!showReferral);
    };

    // Function to generate referral ID
    const generateReferralId = () => {
        const randomNum = Math.floor(10000 + Math.random() * 90000); // Generates a 5-digit number
        return `ATS${randomNum}`;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            try {
                // Set submitting state to true immediately
                setIsSubmitting(true);
                
                // Generate referral ID before submission
                const referral_id = generateReferralId();
                
                const submitData = {
                    ...formData,
                    referral_id,
                    // Remove fields not needed by the server
                    repeatPassword: undefined
                };

                // First, send OTP
                const otpResponse = await fetch('http://localhost:3030/api/send-signup-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: submitData.email
                    }),
                });

                const otpData = await otpResponse.json();

                if (otpResponse.ok) {
                    // If OTP sent successfully, navigate to OTP verification page immediately
                    navigate('/signup-otp', { state: { formData: submitData } });
                } else {
                    setErrors(prev => ({
                        ...prev,
                        submit: otpData.error || 'Failed to send OTP. Please try again.'
                    }));
                    // Reset submitting state if there's an error
                    setIsSubmitting(false);
                }
            } catch (error) {
                setErrors(prev => ({
                    ...prev,
                    submit: 'An error occurred during registration. Please try again.'
                }));
                // Reset submitting state if there's an error
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="Signup Form">
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
                                    <img 
                                        className="img-src" 
                                        src={signupImage}
                                        alt="Signup" 
                                    />
                                </div>

                                <div className="Name_Flex">
                                    <div className="Name_Tag">
                                        <h1 className="Name_Tag">Signup</h1>
                                    </div>

                                    {errors.submit && (
                                        <div className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
                                            {errors.submit}
                                        </div>
                                    )}

                                    <form className="Details_submit" onSubmit={handleSubmit}>
                                        {errors.submit && <div className="error-message">{errors.submit}</div>}
                                        
                                        <div className="Input_name">
                                            <label className="Label_Type">Username</label>
                                            <input
                                                type="text"
                                                id='username'
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                className={errors.username ? 'error-input' : ''}
                                                placeholder="Enter your username"
                                            />
                                            {errors.username && <div className="error-msg">{errors.username}</div>}
                                        </div>

                                        <div className="Input_name">
                                            <label className="Label_Type">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                id='email'  
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={errors.email ? 'error-input' : ''}
                                                placeholder="Enter your email"
                                            />
                                            {errors.email && <div className="error-msg">{errors.email}</div>}
                                        </div>

                                        <div className="Input_name">
                                            <label className="Label_Type">Phone</label>
                                            <input
                                                type="number"
                                                name="phone"
                                                id='phone'  
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className={errors.phone ? 'error-input' : ''}
                                                placeholder="Enter your phone number"
                                            />
                                            {errors.phone && <div className="error-msg">{errors.phone}</div>}
                                        </div>

                                        <div className="Input_name">
                                            <label className="Label_Type">TradingView ID</label>
                                            <input
                                                type="text"
                                                name="tradingViewId"
                                                id='tradingViewId'
                                                value={formData.tradingViewId}
                                                onChange={handleInputChange}
                                                className={errors.tradingViewId ? 'error-input' : ''}
                                                placeholder="Enter your TradingView ID"
                                            />
                                            {errors.tradingViewId && <div className="error-msg">{errors.tradingViewId}</div>}
                                        </div>

                                        <div className="Input_name">
                                            <label className="Label_Type">Password</label>
                                            <div className="password-input-container">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    id='password'       
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    className={errors.password ? 'error-input' : ''}
                                                    placeholder="Enter your password"
                                                />
                                                <i
                                                    className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
                                                    onClick={() => togglePasswordVisibility('password')}
                                                ></i>
                                            </div>
                                            {errors.password && <div className="error-msg">{errors.password}</div>}
                                        </div>

                                        <div className="Input_name">
                                            <label className="Label_Type">Repeat Password</label>
                                            <div className="password-input-container">
                                                <input
                                                    type={showRepeatPassword ? "text" : "password"}
                                                    name="repeatPassword"
                                                    id='repeatPassword'
                                                    value={formData.repeatPassword}
                                                    onChange={handleInputChange}
                                                    className={errors.repeatPassword ? 'error-input' : ''}
                                                    placeholder="Repeat your password"
                                                />
                                                <i
                                                    className={`fa ${showRepeatPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
                                                    onClick={() => togglePasswordVisibility('repeat')}
                                                ></i>
                                            </div>
                                            {errors.repeatPassword && <div className="error-msg">{errors.repeatPassword}</div>}
                                        </div>

                                        <div className="Input_checkbox">
                                            <input
                                                type="checkbox"
                                                id="showReferral"
                                                checked={showReferral}
                                                onChange={toggleReferral}
                                            />
                                            <label htmlFor="showReferral" className="Show_Pass">Have a Referral ID?</label>
                                        </div>

                                        {showReferral && (
                                            <div className="Input_name">
                                                <label className="Label_Type">Referral ID</label>
                                                <input
                                                    type="text"
                                                    name="referralId"
                                                    id='referralId'
                                                    value={formData.referralId}
                                                    onChange={handleInputChange}
                                                    className={errors.referralId ? 'error-input' : ''}
                                                    placeholder="Enter referral ID"
                                                />
                                                {errors.referralId && <div className="error-msg">{errors.referralId}</div>}
                                            </div>
                                        )}

                                        <button 
                                            type="submit" 
                                            className="Btn_submit-signup"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Processing...' : 'Register'}
                                        </button>
                                        <div className="Account_already">
                                            Already have an account? <a className="Login_Page" href="./signin">Sign In</a>
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

export default Signup;
