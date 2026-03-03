import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';
import './Currencies.css';

const Currencies = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [portfolioOpen, setPortfolioOpen] = useState(true);
    const [sellAmount, setSellAmount] = useState('1000');
    const [estimatedReturn, setEstimatedReturn] = useState('923.40');

    // Display user data
    const displayUser = {
        name: user?.user?.name || (user?.user?.first_name ? `${user.user.first_name} ${user.user.last_name || ''}`.trim() : user?.name || 'Cliente'),
        email: user?.user?.email || user?.email || ''
    };

    const handleAmountChange = (e) => {
        const val = e.target.value;
        setSellAmount(val);
        // Mock calculation: 1 USD = 0.9234 EUR
        if (val && !isNaN(val)) {
            setEstimatedReturn((parseFloat(val) * 0.9234).toFixed(2));
        } else {
            setEstimatedReturn('0.00');
        }
    };

    const currencies = [
        { pair: 'EUR / USD', name: 'Eurozone Market', bid: '0.9234', change: '+0.24%', volume: '$1.2B USD', trend: 'up' },
        { pair: 'GBP / USD', name: 'British Pound', bid: '0.7917', change: '-0.12%', volume: '$845M USD', trend: 'down' },
        { pair: 'JPY / USD', name: 'Japanese Yen', bid: '150.45', change: '+1.08%', volume: '$2.1B USD', trend: 'up' },
        { pair: 'AUD / USD', name: 'Australian Dollar', bid: '1.5230', change: '+0.05%', volume: '$430M USD', trend: 'up' },
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
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }} className="nav-item">
                        <span className="nav-icon">📊</span>
                        <span>Dashboard</span>
                    </a>

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
                            <span>Portafolio</span>
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
                                    className="submenu-item active"
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
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">
                            {displayUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
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
                <header className="topbar">
                    <div className="page-header" style={{ width: '100%' }}>
                        <h1 className="page-title">Mercado de Divisas (USD)</h1>
                        <div className="wallet-balance">
                            <span>SALDO BILLETERA</span>
                            <span style={{ color: 'white' }}>$12,450.00</span>
                        </div>
                    </div>
                    <div className="topbar-right">
                        <button className="dark-mode-toggle">🔔</button>
                        <button className="btn-trade">Depositar</button>
                    </div>
                </header>

                <div className="currencies-wrapper">

                    {/* Left Column: Market & Rates */}
                    <div className="currencies-main">
                        <div className="balance-market-row">
                            {/* Blue Balance Card */}
                            <div className="balance-card">
                                <div>
                                    <div className="balance-title">Saldo Disponible USD</div>
                                    <div className="balance-amount">$12,450.00</div>
                                    <div className="balance-subtitle">LÍQUIDO PARA VENTA INMEDIATA</div>
                                </div>

                                <div className="balance-actions">
                                    <button className="balance-btn btn-manage">Administrar</button>
                                    <button className="balance-btn btn-withdraw">Retirar</button>
                                </div>
                            </div>

                            {/* Black Market Card */}
                            <div className="market-card">
                                <div className="market-header">
                                    <div className="market-title">
                                        <h2>Mercado USD</h2>
                                        <p>Vende USD exclusivamente a tasas premium.</p>
                                    </div>
                                    <div className="market-power">
                                        <div className="power-label">PODER DE MERCADO ACTUAL</div>
                                        <div className="power-indicators">
                                            <div className="power-bar active"></div>
                                            <div className="power-bar active"></div>
                                            <div className="power-bar active"></div>
                                            <div className="power-bar active"></div>
                                            <div className="power-bar"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="exchange-inputs">
                                    <div className="input-group">
                                        <label className="input-label">Monto a Vender (USD)</label>
                                        <div className="input-field-wrapper">
                                            <span className="currency-symbol">$</span>
                                            <input
                                                type="number"
                                                className="exchange-input"
                                                value={sellAmount}
                                                onChange={handleAmountChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="exchange-arrow">➔</div>
                                    <div className="input-group">
                                        <label className="input-label">Retorno Estimado (EUR)</label>
                                        <div className="input-field-wrapper">
                                            <span className="currency-symbol">€</span>
                                            <span className="exchange-input value-display">{estimatedReturn}</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="initiate-sale-btn">
                                    ⚡ Iniciar Venta de USD
                                </button>
                            </div>
                        </div>

                        {/* Active Market Rates */}
                        <div className="rates-section">
                            <div className="rates-header">
                                <h3 className="rates-title">Tasas de Mercado Activas</h3>
                                <div className="rates-toggle">
                                    <button className="toggle-btn">Diario</button>
                                    <button className="toggle-btn active">En Vivo</button>
                                </div>
                            </div>

                            <table className="rates-table">
                                <thead>
                                    <tr>
                                        <th>Par de Activos</th>
                                        <th>Oferta Global</th>
                                        <th>Cambio (24H)</th>
                                        <th>Volumen Mercado</th>
                                        <th>Tendencia</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currencies.map((curr, idx) => (
                                        <tr key={idx}>
                                            <td className="asset-cell">
                                                <div className="currency-icon">{curr.pair.charAt(0) === 'E' ? '€' : curr.pair.charAt(0) === 'G' ? '£' : curr.pair.charAt(0) === 'J' ? '¥' : '$'}</div>
                                                <div className="asset-names">
                                                    <h4>{curr.pair}</h4>
                                                    <span>{curr.name}</span>
                                                </div>
                                            </td>
                                            <td className="price-text">{curr.bid}</td>
                                            <td className={`change-text ${curr.trend === 'up' ? 'up' : 'down'}`}>{curr.change}</td>
                                            <td style={{ color: '#9CA3AF' }}>{curr.volume}</td>
                                            <td className="sparkline">
                                                {/* Simple SVG Sparkline */}
                                                <svg width="60" height="20" viewBox="0 0 60 20">
                                                    <path
                                                        d={curr.trend === 'up' ? "M0,15 L10,12 L20,16 L30,5 L40,8 L50,2 L60,0" : "M0,5 L10,8 L20,4 L30,15 L40,12 L50,18 L60,20"}
                                                        fill="none"
                                                        stroke={curr.trend === 'up' ? "#10B981" : "#EF4444"}
                                                        strokeWidth="2"
                                                    />
                                                </svg>
                                            </td>
                                            <td>
                                                <button className="trade-btn">Vender Ahora</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Column: Sidebar Widgets */}
                    <div className="currencies-sidebar">
                        {/* Price Performance */}
                        <div className="perf-card">
                            <div className="sidebar-card-title">Rendimiento de Precio</div>
                            <div className="index-display">
                                <div className="index-header">
                                    <span className="index-name">ÍNDICE USD (DXY)</span>
                                    <span className="index-change">+0.15</span>
                                </div>
                                <div className="index-value">103.84</div>
                            </div>
                            <div className="chart-placeholder"></div>
                        </div>

                        {/* Recent Activity */}
                        <div className="activity-card">
                            <div className="sidebar-card-title">Actividad Reciente</div>
                            <div className="activity-list">
                                <div className="activity-item">
                                    <div className="activity-icon sell">➚</div>
                                    <div className="activity-details">
                                        <h5>Venta de $5,000 USD</h5>
                                        <span className="activity-sub">Recibido €3,950.40 • hace 12m</span>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon fund">💼</div>
                                    <div className="activity-details">
                                        <h5>Billetera Fondeada</h5>
                                        <span className="activity-sub">Añadido $1,500.00 USD • hace 2h</span>
                                    </div>
                                </div>
                                <div className="activity-item">
                                    <div className="activity-icon cancel">↺</div>
                                    <div className="activity-details">
                                        <h5>Orden Cancelada</h5>
                                        <span className="activity-sub">Venta de $250 USD • hace 5h</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Market Tip */}
                        <div className="tip-card">
                            <div className="tip-content">
                                <span className="tip-label">CONSEJO DE MERCADO</span>
                                <p className="tip-text">
                                    Vender USD contra EUR está rindiendo actualmente 15pbs por encima de las tasas interbancarias estándar debido a la alta demanda.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Currencies;
