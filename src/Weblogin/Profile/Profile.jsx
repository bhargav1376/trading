import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaBell, FaSearch } from 'react-icons/fa';
import './Profile.css'; 
import Logo from '../../index/images/Logo.png'; 

const Profile = () => {
    const [userData, setUserData] = useState(null); // Assuming user data is needed
    const [loading, setLoading] = useState(true); // Assuming loading state is needed
    const [error, setError] = useState(''); // Assuming error state is needed
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMenuItem, setActiveMenuItem] = useState('profile'); // Set active menu item to 'profile'
    const [notifications] = useState(3); // Assuming notifications state is needed
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        username: '',
        phone: '',
        dateOfBirth: '',
        address: ''
    });
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

    // Update editForm when userData changes
    useEffect(() => {
        if (userData) {
            setEditForm({
                username: userData.username || '',
                phone: userData.phone || '',
                dateOfBirth: userData.dateOfBirth || '',
                address: userData.address || ''
            });
        }
    }, [userData]);

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

    const handleEditClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveChanges = () => {
        // Here you would typically make an API call to update the user data
        console.log('Saving changes:', editForm);
        // For now, we'll just update the local state
        setUserData(prev => ({
            ...prev,
            ...editForm
        }));
        setIsModalOpen(false);
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
                        <img src="./images/logo.png" alt="Trading Logo" className="logo-homepage" />
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
                            <FaUser />
                            <span className="username">{userData.username}</span>
                        </div>
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
            <div className={`main-content ${isMenuOpen ? 'menu-open' : 'menu-closed'}`}>
                 <div className="profile-attractive-design">
                     <div className="profile-hero-header">
                         <div className="profile-avatar-hero">
                              <i className="fa fa-user-circle"></i>
                              {/* Option to add an image */}
                         </div>
                         <div className="profile-contact-info">
                             <h1 className="profile-hero-name">{userData.username}</h1>
                             <p className="profile-hero-contact">Email: {userData.email || 'No email provided'}</p>
                             <p className="profile-hero-contact">Phone: {userData.phone || 'No phone provided'}</p>
                             {/* Add other key contact info here */}
                         </div>
                         <button className="profile-hero-edit-btn" onClick={handleEditClick}>
                             Edit Profile
                         </button>
                     </div>

                     <div className="profile-details-cards-grid">
                         {/* Personal Details Card */}
                         <div className="profile-card">
                             <h2 className="card-title">Personal Details</h2>
                             <p><strong>Date of Birth:</strong> {userData.dateOfBirth || 'Not provided'}</p>
                             <p><strong>Address:</strong> {userData.address || 'Not provided'}</p>
                             {/* Add more personal details */}
                         </div>

                         {/* Account Overview Card */}
                         <div className="profile-card">
                             <h2 className="card-title">Account Overview</h2>
                             <p><strong>Membership:</strong> Premium</p>
                             <p><strong>Join Date:</strong> January 2023</p>
                             {/* Add more account overview details */}
                         </div>

                          {/* Activity Summary Card */}
                         <div className="profile-card">
                              <h2 className="card-title">Activity Summary</h2>
                              <p>Brief summary of recent activity.</p>
                              {/* Add activity data */}
                          </div>

                          {/* Security Settings Card */}
                         <div className="profile-card">
                              <h2 className="card-title">Security Settings</h2>
                              <p>Security status and options.</p>
                              {/* Add security status/actions */}
                          </div>
                     </div>

                      <div className="profile-footer-buttons">
                           <button className="footer-btn" onClick={() => window.location.href = './activity-log'}>View Full Activity Log</button>
                           <button className="footer-btn secondary" onClick={() => window.location.href = './account-settings'}>Manage Account Settings</button>
                     </div>
                 </div>
            </div>

            {/* Edit Modal */}
            {isModalOpen && (
                <div className="edit-modal-overlay">
                    <div className="edit-modal">
                        <div className="modal-header">
                            <h2>Edit Contact Information</h2>
                            <button className="modal-close-btn" onClick={handleCloseModal}>×</button>
                        </div>
                        <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={userData.email || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={editForm.username}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={editForm.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="dateOfBirth">Date of Birth</label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={editForm.dateOfBirth}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={editForm.address}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="modal-actions">
                                <button className="modal-btn cancel" onClick={handleCloseModal}>Cancel</button>
                                <button className="modal-btn save" onClick={handleSaveChanges}>Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile; 