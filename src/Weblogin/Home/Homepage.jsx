import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    FaBars,
    FaTimes,
    FaSearch,
    FaBitcoin,
    FaDollarSign,
    FaChartBar,
    FaExchangeAlt,
    FaBell,
    FaUserCircle,
    FaArrowUp,
    FaArrowDown,
    FaStar,
    FaRegStar,
    FaFilter
} from 'react-icons/fa';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import './Homepage.css';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Homepage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
    const [notifications] = useState(3);
    const [timeFilter, setTimeFilter] = useState('Today');
    const [marketFilter, setMarketFilter] = useState('All');
    const [watchlist, setWatchlist] = useState(['BTC']);
    const [showAllTrades, setShowAllTrades] = useState(false);
    const navigate = useNavigate();

    // Dummy user data
    const userData = {
        username: 'Demo User',
        isAdmin: false
    };

    // Mock data for demonstration
    const mockMarketData = {
        stocks: { price: 45678.90, change: 2.5, trend: 'up' },
        crypto: { price: 32456.78, change: -1.2, trend: 'down' },
        forex: { price: 1.2345, change: 0.8, trend: 'up' }
    };

    const mockTrades = [
        { id: 1, type: 'BUY', symbol: 'AAPL', amount: '100 shares', price: 150.25, time: '2 min ago', status: 'completed' },
        { id: 2, type: 'SELL', symbol: 'BTC', amount: '0.5 BTC', price: 32456.78, time: '5 min ago', status: 'pending' },
        { id: 3, type: 'BUY', symbol: 'ETH', amount: '2.5 ETH', price: 4567.89, time: '10 min ago', status: 'completed' },
        { id: 4, type: 'SELL', symbol: 'TSLA', amount: '50 shares', price: 234.56, time: '15 min ago', status: 'completed' },
        { id: 5, type: 'BUY', symbol: 'EUR/USD', amount: '1000 units', price: 1.2345, time: '20 min ago', status: 'pending' }
    ];

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

    const handleTimeFilterChange = (e) => {
        setTimeFilter(e.target.value);
    };

    const handleMarketFilterClick = (filter) => {
        setMarketFilter(filter);
    };

    const toggleWatchlist = (symbol) => {
        setWatchlist(prev => {
            if (prev.includes(symbol)) {
                return prev.filter(item => item !== symbol);
            } else {
                return [...prev, symbol];
            }
        });
    };

    const handleViewAllTrades = () => {
        setShowAllTrades(!showAllTrades);
    };

    const handleNotificationClick = () => {
        console.log('Notifications clicked');
    };

    // Line Chart Data
    const lineChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Portfolio Value',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
                borderColor: '#1a237e',
                backgroundColor: 'rgba(26, 35, 126, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Portfolio Performance',
                color: '#1a237e',
                font: {
                    size: 16,
                    weight: 'bold',
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    // Doughnut Chart Data
    const doughnutChartData = {
        labels: ['Stocks', 'Crypto', 'Forex', 'Bonds'],
        datasets: [
            {
                data: [40, 30, 20, 10],
                backgroundColor: [
                    '#1a237e',
                    '#0d47a1',
                    '#64b5f6',
                    '#90caf9',
                ],
                borderWidth: 0,
            },
        ],
    };

    const doughnutChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 20,
                    font: {
                        size: 12,
                    },
                },
            },
            title: {
                display: true,
                text: 'Asset Allocation',
                color: '#1a237e',
                font: {
                    size: 16,
                    weight: 'bold',
                },
            },
        },
        cutout: '70%',
    };

    // Bar Chart Data
    const barChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Trading Volume',
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: 'rgba(26, 35, 126, 0.6)',
                borderColor: '#1a237e',
                borderWidth: 1,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Weekly Trading Volume',
                color: '#1a237e',
                font: {
                    size: 16,
                    weight: 'bold',
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    const displayedTrades = showAllTrades ? mockTrades : mockTrades.slice(0, 3);

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
                            <FaUserCircle />
                            <span className="username">{userData.username}</span>
                        </div>
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
            <div className={`main-content ${isMenuOpen ? 'menu-open' : 'menu-closed'}`}>
                <div className="trading-dashboard">
                    <div className="dashboard-header">
                        <h1>Welcome back, {userData.username}!</h1>
                        <div className="date-filter">
                            <select className="time-filter" value={timeFilter} onChange={handleTimeFilterChange}>
                                <option>Today</option>
                                <option>This Week</option>
                                <option>This Month</option>
                                <option>This Year</option>
                            </select>
                        </div>
                    </div>

                    <div className="quick-stats">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <FaBitcoin />
                            </div>
                            <div className="stat-info">
                                <h3>Total Balance</h3>
                                <p className="stat-value">$45,678.90</p>
                                <p className="stat-change positive">
                                    <FaArrowUp /> +2.5%
                                </p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <FaChartBar />
                            </div>
                            <div className="stat-info">
                                <h3>24h Volume</h3>
                                <p className="stat-value">$12,345.67</p>
                                <p className="stat-change positive">
                                    <FaArrowUp /> +1.2%
                                </p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <FaExchangeAlt />
                            </div>
                            <div className="stat-info">
                                <h3>Active Trades</h3>
                                <p className="stat-value">12</p>
                                <p className="stat-change">
                                    <span className="status-dot active"></span> Running
                                </p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <FaDollarSign />
                            </div>
                            <div className="stat-info">
                                <h3>Profit/Loss</h3>
                                <p className="stat-value">$2,345.67</p>
                                <p className="stat-change positive">
                                    <FaArrowUp /> +5.2%
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="charts-grid">
                        <div className="chart-card">
                            <div className="chart-header">
                                <h2>Portfolio Performance</h2>
                                <div className="chart-actions">
                                    <button className="chart-action-btn" onClick={() => handleMarketFilterClick('all')}>
                                        <FaFilter />
                                    </button>
                                </div>
                            </div>
                            <div className="chart-container">
                                <Line data={lineChartData} options={lineChartOptions} />
                            </div>
                        </div>
                        <div className="chart-card">
                            <div className="chart-header">
                                <h2>Asset Allocation</h2>
                                <div className="chart-actions">
                                    <button className="chart-action-btn" onClick={() => handleMarketFilterClick('all')}>
                                        <FaFilter />
                                    </button>
                                </div>
                            </div>
                            <div className="chart-container">
                                <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                            </div>
                        </div>
                        <div className="chart-card full-width">
                            <div className="chart-header">
                                <h2>Weekly Trading Volume</h2>
                                <div className="chart-actions">
                                    <button className="chart-action-btn" onClick={() => handleMarketFilterClick('all')}>
                                        <FaFilter />
                                    </button>
                                </div>
                            </div>
                            <div className="chart-container">
                                <Bar data={barChartData} options={barChartOptions} />
                            </div>
                        </div>
                    </div>

                    <div className="market-overview">
                        <div className="section-header">
                            <h2>Market Overview</h2>
                            <div className="market-filters">
                                <button 
                                    className={`filter-btn ${marketFilter === 'All' ? 'active' : ''}`}
                                    onClick={() => handleMarketFilterClick('All')}
                                >
                                    All
                                </button>
                                <button 
                                    className={`filter-btn ${marketFilter === 'Stocks' ? 'active' : ''}`}
                                    onClick={() => handleMarketFilterClick('Stocks')}
                                >
                                    Stocks
                                </button>
                                <button 
                                    className={`filter-btn ${marketFilter === 'Crypto' ? 'active' : ''}`}
                                    onClick={() => handleMarketFilterClick('Crypto')}
                                >
                                    Crypto
                                </button>
                                <button 
                                    className={`filter-btn ${marketFilter === 'Forex' ? 'active' : ''}`}
                                    onClick={() => handleMarketFilterClick('Forex')}
                                >
                                    Forex
                                </button>
                            </div>
                        </div>
                        <div className="market-cards">
                            <div className="market-card">
                                <div className="card-header">
                                    <h3>Stocks</h3>
                                    <FaDollarSign className="card-icon" />
                                </div>
                                <div className="card-content">
                                    <p className="price">${mockMarketData.stocks.price.toLocaleString()}</p>
                                    <p className={`change ${mockMarketData.stocks.trend === 'up' ? 'positive' : 'negative'}`}>
                                        {mockMarketData.stocks.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                                        {mockMarketData.stocks.change}%
                                    </p>
                                    <div className="trend-indicator">
                                        <span className="trend-dot"></span>
                                        <span className="trend-line"></span>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <span>Last updated: 2 min ago</span>
                                    <button 
                                        className="watch-btn"
                                        onClick={() => toggleWatchlist('STOCKS')}
                                    >
                                        {watchlist.includes('STOCKS') ? <FaStar /> : <FaRegStar />}
                                    </button>
                                </div>
                            </div>
                            <div className="market-card">
                                <div className="card-header">
                                    <h3>Crypto</h3>
                                    <FaBitcoin className="card-icon" />
                                </div>
                                <div className="card-content">
                                    <p className="price">${mockMarketData.crypto.price.toLocaleString()}</p>
                                    <p className={`change ${mockMarketData.crypto.trend === 'up' ? 'positive' : 'negative'}`}>
                                        {mockMarketData.crypto.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                                        {mockMarketData.crypto.change}%
                                    </p>
                                    <div className="trend-indicator">
                                        <span className="trend-dot"></span>
                                        <span className="trend-line"></span>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <span>Last updated: 1 min ago</span>
                                    <button 
                                        className="watch-btn"
                                        onClick={() => toggleWatchlist('BTC')}
                                    >
                                        {watchlist.includes('BTC') ? <FaStar /> : <FaRegStar />}
                                    </button>
                                </div>
                            </div>
                            <div className="market-card">
                                <div className="card-header">
                                    <h3>Forex</h3>
                                    <FaExchangeAlt className="card-icon" />
                                </div>
                                <div className="card-content">
                                    <p className="price">${mockMarketData.forex.price.toLocaleString()}</p>
                                    <p className={`change ${mockMarketData.forex.trend === 'up' ? 'positive' : 'negative'}`}>
                                        {mockMarketData.forex.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                                        {mockMarketData.forex.change}%
                                    </p>
                                    <div className="trend-indicator">
                                        <span className="trend-dot"></span>
                                        <span className="trend-line"></span>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <span>Last updated: 5 min ago</span>
                                    <button 
                                        className="watch-btn"
                                        onClick={() => toggleWatchlist('FOREX')}
                                    >
                                        {watchlist.includes('FOREX') ? <FaStar /> : <FaRegStar />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="recent-trades">
                        <div className="section-header">
                            <h2>Recent Trades</h2>
                            <button className="view-all-btn" onClick={handleViewAllTrades}>
                                {showAllTrades ? 'Show Less' : 'View All'}
                            </button>
                        </div>
                        <div className="trades-list">
                            {displayedTrades.map(trade => (
                                <div key={trade.id} className="trade-item">
                                    <div className="trade-info">
                                        <span className={`trade-type ${trade.type.toLowerCase()}`}>
                                            {trade.type}
                                        </span>
                                        <span className="trade-symbol">{trade.symbol}</span>
                                        <span className="trade-amount">{trade.amount}</span>
                                    </div>
                                    <div className="trade-details">
                                        <span className="trade-price">${trade.price.toLocaleString()}</span>
                                        <span className="trade-time">{trade.time}</span>
                                    </div>
                                    <div className="trade-status">
                                        <span className={`status-badge ${trade.status}`}>
                                            {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;