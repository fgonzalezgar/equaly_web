import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../dashboard/Dashboard.css';
import './Stocks.css';

const Stocks = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [portfolioOpen, setPortfolioOpen] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('1W');

    const displayUser = {
        name: user?.user?.name || (user?.user?.first_name ? `${user.user.first_name} ${user.user.last_name || ''}`.trim() : user?.name || 'Cliente'),
        email: user?.user?.email || user?.email || ''
    };

    // Mock portfolio data
    const portfolioMetrics = {
        totalBalance: 124500.00,
        balanceChange: 2.4,
        dailyPL: 1240.50,
        dailyPLPercent: 1.2,
        totalReturn: 15400.00,
        totalReturnPercent: 12.4,
        buyingPower: 12300.00
    };

    const stocks = [
        {
            id: 'AAPL',
            name: 'Apple Inc.',
            symbol: 'AAPL',
            shares: 50.00,
            avgCost: 145.20,
            currentPrice: 189.45,
            marketValue: 9472.50,
            icon: '🍎',
            color: '#007AFF'
        },
        {
            id: 'AMZN',
            name: 'Amazon.com',
            symbol: 'AMZN',
            shares: 20.00,
            avgCost: 110.00,
            currentPrice: 132.70,
            marketValue: 2654.00,
            icon: '📦',
            color: '#FF9900'
        },
        {
            id: 'NVDA',
            name: 'NVIDIA Corp.',
            symbol: 'NVDA',
            shares: 15.00,
            avgCost: 280.00,
            currentPrice: 460.20,
            marketValue: 6903.00,
            icon: '🎮',
            color: '#76B900'
        },
        {
            id: 'BTC',
            name: 'Bitcoin',
            symbol: 'BTC',
            shares: 0.45,
            avgCost: 42100,
            currentPrice: 64250,
            marketValue: 28912.50,
            icon: '₿',
            color: '#F7931A'
        }
    ];

    const sectorDistribution = [
        { name: 'Technology', percentage: 45, color: '#3b82f6' },
        { name: 'Finance', percentage: 25, color: '#10b981' },
        { name: 'Crypto', percentage: 15, color: '#f59e0b' },
        { name: 'Others', percentage: 15, color: '#6b7280' }
    ];

    return (
        <div className="dashboard-wrapper">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-container">
                        <img src="/equaly-logo.png" alt="EQUALY" className="logo-icon" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
                        <div>
                            <div className="logo-text">EQUALY</div>
                            <div className="logo-subtitle">● Cuenta Premium</div>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <a
                        href="#"
                        className="nav-item"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/dashboard');
                        }}
                    >
                        <span className="nav-icon">📊</span>
                        <span>Dashboard</span>
                    </a>

                    {/* Portfolio with Submenu */}
                    <div className="nav-item-group">
                        <a
                            href="#"
                            className={`nav-item ${portfolioOpen ? 'open' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setPortfolioOpen(!portfolioOpen);
                            }}
                        >
                            <span className="nav-icon">💼</span>
                            <span>Portfolio</span>
                            <span className="nav-arrow">{portfolioOpen ? '▼' : '▶'}</span>
                        </a>
                        {portfolioOpen && (
                            <div className="submenu">
                                <a
                                    href="#"
                                    className="submenu-item active"
                                >
                                    <span className="submenu-icon">📈</span>
                                    <span>Acciones</span>
                                </a>
                                <a
                                    href="#"
                                    className="submenu-item"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/dashboard/plans');
                                    }}
                                >
                                    <span className="submenu-icon">📋</span>
                                    <span>Planes</span>
                                </a>
                                <a
                                    href="#"
                                    className="submenu-item"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/dashboard/currencies');
                                    }}
                                >
                                    <span className="submenu-icon">💱</span>
                                    <span>Divisas</span>
                                </a>
                                <a href="#" className="submenu-item">
                                    <span className="submenu-icon">₿</span>
                                    <span>Criptomonedas</span>
                                </a>
                            </div>
                        )}
                    </div>

                    <a href="#" className="nav-item">
                        <span className="nav-icon">📰</span>
                        <span>Market News</span>
                    </a>
                    <a href="#" className="nav-item">
                        <span className="nav-icon">📈</span>
                        <span>Advanced Charts</span>
                    </a>
                    <a href="#" className="nav-item">
                        <span className="nav-icon">⚙️</span>
                        <span>Settings</span>
                    </a>
                    <a href="#" className="nav-item">
                        <span className="nav-icon">🔔</span>
                        <span>Alerts</span>
                    </a>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">
                            {displayUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                            <div className="user-name">{displayUser.name}</div>
                            <div className="user-status">{displayUser.email}</div>
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                navigate('/login');
                            }}
                            className="logout-icon"
                            title="Cerrar sesión"
                        >
                            ⎋
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Top Bar */}
                <header className="topbar">
                    <h1 className="page-title-header">Portfolio Overview</h1>
                    <div className="topbar-right">
                        <div className="last-updated">
                            Last updated: <span>Just now</span>
                        </div>
                        <div className="search-container-small">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search assets..."
                                className="search-input"
                            />
                        </div>
                        <button className="notification-btn">🔔</button>
                        <button
                            className="btn-deposit"
                            onClick={() => navigate('/dashboard/buy')}
                        >
                            + Deposit
                        </button>
                    </div>
                </header>

                {/* Portfolio Metrics Cards */}
                <div className="portfolio-metrics">
                    <div className="metric-card-portfolio">
                        <div className="metric-header">
                            <span className="metric-label">Total Balance</span>
                            <span className="metric-icon-small">💼</span>
                        </div>
                        <div className="metric-value-large">${portfolioMetrics.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        <div className="metric-change positive">
                            📈 +{portfolioMetrics.balanceChange}% this month
                        </div>
                    </div>

                    <div className="metric-card-portfolio">
                        <div className="metric-header">
                            <span className="metric-label">Daily P/L</span>
                            <span className="metric-icon-small">📊</span>
                        </div>
                        <div className="metric-value-large positive">+${portfolioMetrics.dailyPL.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        <div className="metric-change">
                            Today ( +{portfolioMetrics.dailyPLPercent}% )
                        </div>
                    </div>

                    <div className="metric-card-portfolio">
                        <div className="metric-header">
                            <span className="metric-label">Total Return</span>
                            <span className="metric-icon-small">📈</span>
                        </div>
                        <div className="metric-value-large positive">+${portfolioMetrics.totalReturn.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        <div className="metric-change positive">
                            ↗ {portfolioMetrics.totalReturnPercent}% All time
                        </div>
                    </div>

                    <div className="metric-card-portfolio">
                        <div className="metric-header">
                            <span className="metric-label">Buying Power</span>
                            <span className="metric-icon-small">💰</span>
                        </div>
                        <div className="metric-value-large">${portfolioMetrics.buyingPower.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        <div className="metric-change">
                            Cash available
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="portfolio-grid">
                    {/* Asset Performance Table */}
                    <div className="asset-performance-section">
                        <div className="section-header-portfolio">
                            <h2>Asset Performance</h2>
                            <div className="period-selector">
                                {['1D', '1W', '1M', 'All'].map((period) => (
                                    <button
                                        key={period}
                                        className={`period-btn ${selectedPeriod === period ? 'active' : ''}`}
                                        onClick={() => setSelectedPeriod(period)}
                                    >
                                        {period}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="performance-table">
                            <table className="stocks-table">
                                <thead>
                                    <tr>
                                        <th>ASSET</th>
                                        <th>SHARES</th>
                                        <th>AVG. COST</th>
                                        <th>CURRENT</th>
                                        <th>MARKET VALUE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stocks.map((stock) => (
                                        <tr key={stock.id}>
                                            <td>
                                                <div className="asset-cell">
                                                    <span className="asset-icon" style={{ background: stock.color }}>
                                                        {stock.icon}
                                                    </span>
                                                    <div>
                                                        <div className="asset-name-stock">{stock.name}</div>
                                                        <div className="asset-symbol">{stock.symbol}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{stock.shares.toFixed(2)}</td>
                                            <td>${stock.avgCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                            <td className={stock.currentPrice > stock.avgCost ? 'positive' : 'negative'}>
                                                ${stock.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="market-value">${stock.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Sector Distribution & Investment Plan */}
                    <div className="sidebar-widgets">
                        {/* Sector Distribution */}
                        <div className="widget-card">
                            <h3>Sector Distribution</h3>
                            <div className="sector-chart">
                                <div className="donut-chart">
                                    <svg viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20"
                                            strokeDasharray="113 283" strokeDashoffset="0" />
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20"
                                            strokeDasharray="71 283" strokeDashoffset="-113" />
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="20"
                                            strokeDasharray="42 283" strokeDashoffset="-184" />
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#6b7280" strokeWidth="20"
                                            strokeDasharray="42 283" strokeDashoffset="-226" />
                                    </svg>
                                    <div className="chart-center">
                                        <div className="sector-count">4</div>
                                        <div className="sector-label">SECTORS</div>
                                    </div>
                                </div>
                            </div>
                            <div className="sector-legend">
                                {sectorDistribution.map((sector, idx) => (
                                    <div key={idx} className="legend-item">
                                        <div className="legend-dot" style={{ background: sector.color }}></div>
                                        <span className="legend-name">{sector.name}</span>
                                        <span className="legend-percent">{sector.percentage}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Investment Plan */}
                        <div className="widget-card investment-plan">
                            <h3>Investment Plan</h3>
                            <p className="plan-description">
                                You're on track to reach your $200k goal by Dec 2025.
                            </p>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '62%' }}></div>
                            </div>
                            <div className="progress-labels">
                                <span className="current-amount">$124.5k Current</span>
                                <span className="goal-amount">$200k Goal</span>
                            </div>
                            <button className="btn-adjust-plan">Adjust Plan</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Stocks;
