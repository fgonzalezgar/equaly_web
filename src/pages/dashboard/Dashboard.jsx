import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [portfolioOpen, setPortfolioOpen] = useState(false);

    // Display user data (extract from nested user object)
    const displayUser = {
        name: user?.user?.name || (user?.user?.first_name ? `${user.user.first_name} ${user.user.last_name || ''}`.trim() : user?.name || 'Cliente'),
        email: user?.user?.email || user?.email || ''
    };

    // Mock data for market
    const equities = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: '$182.52', change: '+1.25%', trend: 'bullish', chart: [40, 45, 42, 50, 52, 60, 65] },
        { symbol: 'TSLA', name: 'Tesla, Inc.', price: '$238.45', change: '-2.10%', trend: 'bearish', chart: [70, 65, 60, 55, 50, 48, 45] },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$726.13', change: '+3.40%', trend: 'bullish', chart: [30, 35, 40, 50, 60, 70, 75] }
    ];

    const currencies = [
        { pair: 'EUR/USD', rate: '1.0842', change: 'BULLISH', pips: '+12 PIPS' },
        { pair: 'GBP/USD', rate: '1.2655', change: 'BEARISH', pips: '-8 PIPS' },
        { pair: 'USD/JPY', rate: '150.14', change: 'BULLISH', pips: '+5 PIPS' }
    ];

    const cryptos = [
        { symbol: 'BTC', name: 'Bitcoin', price: '$52,144.20', change: '+4.12%' },
        { symbol: 'ETH', name: 'Ethereum', price: '$2,940.11', change: '+1.85%' },
        { symbol: 'SOL', name: 'Solana', price: '$108.67', change: '-0.45%' },
        { symbol: 'BNB', name: 'BNB', price: '$352.42', change: '+0.22%' }
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
                            <div className="logo-subtitle">● Mercados en Vivo</div>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <a href="#" className="nav-item active">
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
                                    className="submenu-item"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/dashboard/stocks');
                                    }}
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
                        <span>Noticias del Mercado</span>
                    </a>
                    <a href="#" className="nav-item">
                        <span className="nav-icon">📈</span>
                        <span>Gráficos Avanzados</span>
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard/profile'); }} className="nav-item">
                        <span className="nav-icon">⚙️</span>
                        <span>Configuración</span>
                    </a>
                    <a href="#" className="nav-item">
                        <span className="nav-icon">🔔</span>
                        <span>Alertas</span>
                    </a>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar" onClick={() => navigate('/dashboard/profile')} style={{ cursor: 'pointer' }}>
                            {displayUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info" onClick={() => navigate('/dashboard/profile')} style={{ cursor: 'pointer' }}>
                            <div className="user-name">{displayUser.name}</div>
                            <div className="user-status">Cuenta Premium</div>
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
                    <div className="search-container">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Buscar mercados, activos o noticias..."
                            className="search-input"
                        />
                    </div>

                    <div className="topbar-right">
                        <div className="market-ticker">
                            <div className="ticker-item">
                                <span className="ticker-label">S&P 500</span>
                                <span className="ticker-value positive">5,005.57 <small>+0.42%</small></span>
                            </div>
                            <div className="ticker-item">
                                <span className="ticker-label">NASDAQ</span>
                                <span className="ticker-value negative">15,990.66 <small>-0.8%</small></span>
                            </div>
                        </div>
                        <button className="dark-mode-toggle">🌙</button>
                        <button className="btn-trade">Operar Ahora</button>
                    </div>
                </header>

                {/* Market Overview */}
                <div className="content-area">
                    <h1 className="page-title">Resumen del Mercado</h1>

                    <div className="market-grid">
                        {/* Equities */}
                        <div className="market-section">
                            <div className="section-header">
                                <div className="section-title">
                                    <span className="section-icon">📈</span>
                                    <span>Acciones</span>
                                </div>
                                <a href="#" className="view-all">Ver Todo</a>
                            </div>

                            <div className="asset-list">
                                {equities.map((stock, idx) => (
                                    <div key={idx} className="asset-card">
                                        <div className="asset-info">
                                            <div className="asset-symbol">{stock.symbol}</div>
                                            <div className="asset-name">{stock.name}</div>
                                        </div>
                                        <div className="asset-price-section">
                                            <div className="asset-price">{stock.price}</div>
                                            <div className={`asset-change ${stock.trend}`}>{stock.change}</div>
                                        </div>
                                        <div className="mini-chart">
                                            {stock.chart.map((val, i) => (
                                                <div
                                                    key={i}
                                                    className={`chart-bar ${stock.trend}`}
                                                    style={{ height: `${val}%` }}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Currencies */}
                        <div className="market-section">
                            <div className="section-header">
                                <div className="section-title">
                                    <span className="section-icon">💱</span>
                                    <span>Divisas</span>
                                </div>
                                <a href="#" className="view-all">Ver Todo</a>
                            </div>

                            <div className="asset-list">
                                {currencies.map((curr, idx) => (
                                    <div key={idx} className="asset-card currency">
                                        <div className="currency-flags">
                                            <span className="flag">{curr.pair.includes('EUR') ? '🇪🇺' : curr.pair.includes('GBP') ? '🇬🇧' : '🇺🇸'}</span>
                                            <span className="flag">🇺🇸</span>
                                        </div>
                                        <div className="asset-info">
                                            <div className="asset-symbol">{curr.pair}</div>
                                            <div className="asset-name">{curr.pips}</div>
                                        </div>
                                        <div className="asset-price-section">
                                            <div className="asset-price">{curr.rate}</div>
                                            <div className={`asset-change ${curr.change.toLowerCase()}`}>
                                                {curr.change === 'BULLISH' ? '📈 ALCISTA' : '📉 BAJISTA'}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Market Sentiment */}
                                <div className="sentiment-card">
                                    <div className="sentiment-header">
                                        <span>SENTIMIENTO DEL MERCADO</span>
                                        <span className="sentiment-label">Actualizando en vivo...</span>
                                    </div>
                                    <div className="sentiment-bar">
                                        <div className="sentiment-long" style={{ width: '65%' }}>
                                            <span>65% LARGO</span>
                                        </div>
                                        <div className="sentiment-short" style={{ width: '35%' }}>
                                            <span>35% CORTO</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Digital Assets */}
                        <div className="market-section">
                            <div className="section-header">
                                <div className="section-title">
                                    <span className="section-icon">₿</span>
                                    <span>Activos Digitales</span>
                                </div>
                                <a href="#" className="view-all">Ver Todo</a>
                            </div>

                            <div className="asset-list">
                                {cryptos.map((crypto, idx) => (
                                    <div key={idx} className="asset-card crypto">
                                        <div className="crypto-icon">
                                            {crypto.symbol === 'BTC' ? '₿' : crypto.symbol === 'ETH' ? '⟠' : crypto.symbol === 'SOL' ? '◎' : '◆'}
                                        </div>
                                        <div className="asset-info">
                                            <div className="asset-symbol">{crypto.name}</div>
                                            <div className="asset-name">{crypto.symbol}/USD</div>
                                        </div>
                                        <div className="asset-price-section">
                                            <div className="asset-price">{crypto.price}</div>
                                            <div className={`asset-change ${crypto.change.includes('+') ? 'bullish' : 'bearish'}`}>
                                                {crypto.change}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* News Ticker */}
                <div className="news-ticker">
                    <span className="ticker-text">
                        🔴 NOTICIAS DEL MERCADO: LA RESERVA FEDERAL DE EE.UU. MANTIENE LAS TASAS DE INTERÉS ESTABLES POR CUARTA REUNIÓN CONSECUTIVA. &nbsp;&nbsp;&nbsp;
                        🔴 ALERTA CRIPTO: BITCOIN ALCANZA NUEVO RÉCORD EN TASA DE HASH.
                    </span>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
