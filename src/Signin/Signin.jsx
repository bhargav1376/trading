import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signin.css';

const Signin = () => {
    const navigate = useNavigate();
    
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

    // Mock user data
    const mockUsers = [
        { userId: 'admin@example.com', password: 'Admin@123', isAdmin: true },
        { userId: 'b@gmail.com', password: 'b', isAdmin: false }
    ];

    const showError = (message) => {
        setErrorMessage(message);
        setShowErrorPopup(true);
        setTimeout(() => {
            setShowErrorPopup(false);
        }, 4000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
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

        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        setTimeout(() => setShowPassword(false), 4000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            setErrors(prev => ({ ...prev, submit: '', userId: '', password: '' }));

            // Mock login logic
            const user = mockUsers.find(u => u.userId === formData.userId);
            
            if (!user) {
                showError('Invalid email, or phone number');
                setErrors(prev => ({ ...prev, userId: 'error' }));
            } else if (user.password !== formData.password) {
                showError('Invalid password');
                setErrors(prev => ({ ...prev, password: 'error' }));
            } else {
                // Mock successful login
                const userData = {
                    userId: user.userId,
                    isAdmin: user.isAdmin,
                    username: user.userId.split('@')[0]
                };
                
                sessionStorage.setItem('userData', JSON.stringify(userData));
                
                if (user.isAdmin) {
                    navigate('/bhargav1376/trading.git/admin');
                } else {
                    navigate('/homepage');
                }
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Login error:', error);
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
                        <div className="Login_from_flex-l">
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
                                                onClick={handleSubmit}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? 'Logging in...' : 'Login'}
                                            </button>
                                            <div className="Account_already">
                                                Doesn't have an account yet? <Link className="Login_Page" to="/signup">Sign Up</Link>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="img_src-lo">
                                    <div className="img-tr">
                                        <img className="img-src-login" src="https://bhargav1376.github.io/trading/Images/log.jpg" alt="Trading" />
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
