import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaBell, FaSearch } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMenuItem, setActiveMenuItem] = useState('profile');
    const [notifications] = useState(3);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        username: 'Demo User',
        email: 'demo@example.com',
        phone: '+1 234 567 8900',
        dateOfBirth: '1990-01-01',
        address: '123 Demo Street, Demo City'
    });

    // Dummy user data
    const userData = {
        username: 'Demo User',
        email: 'demo@example.com',
        phone: '+1 234 567 8900',
        dateOfBirth: '1990-01-01',
        address: '123 Demo Street, Demo City',
        membership: 'Premium',
        joinDate: 'January 2023',
        activity: {
            lastLogin: '2 hours ago',
            totalTrades: 156,
            successRate: '78%'
        }
    };

    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/signin');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMenuItemClick = (menuItem) => {
        setActiveMenuItem(menuItem);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
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
        console.log('Saving changes:', editForm);
        setIsModalOpen(false);
    };

    return (
        <div className="homepage-container">
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
                         </div>
                         <div className="profile-contact-info">
                             <h1 className="profile-hero-name">{userData.username}</h1>
                             <p className="profile-hero-contact">Email: {userData.email}</p>
                             <p className="profile-hero-contact">Phone: {userData.phone}</p>
                         </div>
                         <button className="profile-hero-edit-btn" onClick={handleEditClick}>
                             Edit Profile
                         </button>
                     </div>

                     <div className="profile-details-cards-grid">
                         <div className="profile-card">
                             <h2 className="card-title">Personal Details</h2>
                             <p><strong>Date of Birth:</strong> {userData.dateOfBirth}</p>
                             <p><strong>Address:</strong> {userData.address}</p>
                         </div>

                         <div className="profile-card">
                             <h2 className="card-title">Account Overview</h2>
                             <p><strong>Membership:</strong> {userData.membership}</p>
                             <p><strong>Join Date:</strong> {userData.joinDate}</p>
                         </div>

                         <div className="profile-card">
                              <h2 className="card-title">Activity Summary</h2>
                              <p><strong>Last Login:</strong> {userData.activity.lastLogin}</p>
                              <p><strong>Total Trades:</strong> {userData.activity.totalTrades}</p>
                              <p><strong>Success Rate:</strong> {userData.activity.successRate}</p>
                          </div>

                          <div className="profile-card">
                              <h2 className="card-title">Security Settings</h2>
                              <p><strong>Two-Factor Auth:</strong> Enabled</p>
                              <p><strong>Last Password Change:</strong> 30 days ago</p>
                          </div>
                     </div>
                 </div>
            </div>

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
                                    value={userData.email}
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