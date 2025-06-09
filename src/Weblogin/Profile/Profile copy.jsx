import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    FaBars,
    FaTimes,
    FaSearch,
    FaBell,
    FaUserCircle,
} from 'react-icons/fa';
import './Profile.css'; // Import Profile CSS
import Logo from '../../index/images/Logo.png'; // Adjust Logo path

const Profile = () => {
    const [userData, setUserData] = useState(null); // Assuming user data is needed
    const [loading, setLoading] = useState(true); // Assuming loading state is needed
    const [error, setError] = useState(''); // Assuming error state is needed
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMenuItem, setActiveMenuItem] = useState('profile'); // Set active menu item to 'profile'
    const [notifications] = useState(3); // Assuming notifications state is needed
    const navigate = useNavigate();

    // Add useEffect to load user data (similar to Homepage)
     useEffect(() => {
        const storedUserData = sessionStorage.getItem('userData');
        if (storedUserData) {
            try {
                const parsedData = JSON.parse(storedUserData);
                if (parsedData && parsedData.id) {
                    setUserData(parsedData);
                } else {
                    setError('Invalid user data');
                    // Optionally redirect to login if invalid data
                }
            } catch (err) {
                setError('Error loading user data');
                 // Optionally redirect to login on error
            }
        } else {
            setError('Please login to view your details');
            // Optionally redirect to login if not logged in
        }
        setLoading(false);
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('userData');
        navigate('/signin'); // Assuming signin route
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

     const handleMenuItemClick = (menuItem) => {
        setActiveMenuItem(menuItem);
        // Add navigation logic here if needed, or handle via Link to prop
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        console.log('Searching for:', e.target.value);
    };

     const handleNotificationClick = () => {
        console.log('Notifications clicked');
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!userData) {
        return <div className="error-message">No user data found. Please login again.</div>;
    }

    return (
        <div className="homepage-container"> {/* Using homepage-container class for consistent layout */} 
            <div className={`sidebar ${isMenuOpen ? '' : 'menu-closed'}`}>
                <nav className={`sidebar-menu ${isMenuOpen ? 'menu-open' : 'menu-closed'}`}>
                    <ul>
                        <Link
                            to="/homepage" 
                            className={activeMenuItem === 'dashboard' ? 'active' : ''}
                            onClick={() => handleMenuItemClick('dashboard')}
                        >
                            <li>
                                <i className="fa fa-chart-line"></i> <span>Dashboard</span>
                            </li>
                        </Link>
                         <Link 
                            to="/profile"
                            className={activeMenuItem === 'profile' ? 'active' : ''}
                            onClick={() => handleMenuItemClick('profile')}
                         >
                            <li>
                                <i className="fa fa-user-circle"></i> <span>profile</span>
                            </li>
                         </Link>
                         <Link
                            to="/wallet"
                            className={activeMenuItem === 'wallet' ? 'active' : ''}
                            onClick={() => handleMenuItemClick('wallet')}
                        >
                            <li>
                                <i className="fa fa-wallet"></i> <span>Wallet</span>
                            </li>
                        </Link>
                        <Link
                            to="/history"
                            className={activeMenuItem === 'history' ? 'active' : ''}
                            onClick={() => handleMenuItemClick('history')}
                        >
                            <li>
                                <i className="fa fa-history"></i> <span>History</span>
                            </li>
                        </Link>
                          
                          <Link
                            to="/settings" 
                            className={activeMenuItem === 'settings' ? 'active' : ''}
                            onClick={() => handleMenuItemClick('settings')}
                        >
                            <li>
                                <i className="fa fa-cog"></i> <span>Settings</span>
                            </li>
                        </Link>
                    </ul>
                </nav>
            </div>

            <div className="top-bar_container-home"> 
                <div className="top-bar">
                    <div className="logo-container">
                        <img src={Logo} alt="Trading Logo" className="logo-homepage" />
                        <button className="menu-toggle" onClick={toggleMenu}>
                            {isMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                    <div className="search-container">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search for stocks, crypto, or forex..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="search-input"
                        />
                    </div>
                    <div className="user-info">
                        <div className="notifications" onClick={handleNotificationClick}>
                            <FaBell />
                            {notifications > 0 && <span className="notification-badge">{notifications}</span>}
                        </div>
                        <div className="user-profile">
                            <FaUserCircle />
                            <span className="username">{userData.username}</span>
                        </div>
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
            <div className={`main-content ${isMenuOpen ? 'menu-open' : 'menu-closed'}`}>
                 
            </div>
        </div>
    );
};

export default Profile; 