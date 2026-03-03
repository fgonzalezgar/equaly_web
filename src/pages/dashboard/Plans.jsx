import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css'; // Import base dashboard styles
import './Plans.css';     // Import specific plans styles

const Plans = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [portfolioOpen, setPortfolioOpen] = useState(true);

    // Display user data
    const displayUser = {
        name: user?.user?.name || (user?.user?.first_name ? `${user.user.first_name} ${user.user.last_name || ''}`.trim() : user?.name || 'Cliente'),
        email: user?.user?.email || user?.email || ''
    };

    // Investment Plans Data
    const plans = [
        {
            name: 'Oro',
            tier: 'VIP',
            icon: '🥇',
            roi: '4.0%',
            duration: '60 Días',
            min: 5000,
            max: 25000,
            popular: false
        },
        {
            name: 'Plata',
            tier: 'PRO',
            icon: '🥈',
            roi: '2.5%',
            duration: '45 Días',
            min: 1000,
            max: 4999,
            popular: true
        },
        {
            name: 'Bronce',
            tier: 'BÁSICO',
            icon: '🥉',
            roi: '1.5%',
            duration: '30 Días',
            min: 100,
            max: 999,
            popular: false
        }
    ];

    // Mock Active Subscriptions
    const subscriptions = [
        {
            plan: 'Plan Plata',
            invested: '$2,500.00',
            earning: '+$450.20',
            startDate: '12 Oct, 2023',
            progress: 65,
            status: 'En Curso'
        },
        {
            plan: 'Plan Bronce',
            invested: '$500.00',
            earning: '+$125.00',
            startDate: '28 Sep, 2023',
            progress: 100,
            status: 'Completado'
        }
    ];

    const handleSelectPlan = (plan) => {
        navigate('/dashboard/plans/checkout', { state: { plan } });
    };

    return (
        <div className="dashboard-wrapper">
            {/* Sidebar (Replicated from Dashboard.jsx for consistency) */}
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
                                <a href="#" className="submenu-item active">
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
                    <a href="#" className="nav-item">
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
                {/* Top Bar */}
                <header className="topbar">
                    <div className="page-header" style={{ width: '100%' }}>
                        <h1 className="page-title">Centro de Inversiones</h1>
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

                <div className="content-area plans-wrapper">

                    {/* Plans Grid */}
                    <div className="plans-section">
                        <h2 className="section-title">Planes de Inversión Disponibles</h2>
                        <p className="section-subtitle">Elige el plan que se ajuste a tus objetivos financieros</p>

                        <div className="plans-grid">
                            {plans.map((plan, idx) => (
                                <div key={idx} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
                                    {plan.popular && (
                                        <div className="popular-badge">MÁS POPULAR</div>
                                    )}

                                    <div className="plan-icon-wrapper">
                                        <span className="plan-icon-large">{plan.icon}</span>
                                    </div>

                                    <div className="plan-header">
                                        <div className="plan-name-group">
                                            <div className="plan-name">{plan.name}</div>
                                            <div style={{ color: '#6B7280', fontSize: '12px' }}>
                                                {plan.name === 'Bronce' ? 'Nivel Básico' : plan.name === 'Plata' ? 'Intermedio' : 'Nivel Exclusivo'}
                                            </div>
                                        </div>
                                        <span className="plan-tier">{plan.tier}</span>
                                    </div>

                                    <div className="plan-details">
                                        <div className="detail-row">
                                            <span className="detail-label">ROI Diario</span>
                                            <span className="detail-value highlight">{plan.roi}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Duración</span>
                                            <span className="detail-value">{plan.duration}</span>
                                        </div>
                                    </div>

                                    <button
                                        className="select-plan-btn"
                                        onClick={() => handleSelectPlan(plan)}
                                    >
                                        Seleccionar Plan
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Subscriptions Table */}
                    <div className="subscriptions-section">
                        <div className="section-header-row">
                            <h2 className="section-title" style={{ margin: 0 }}>Mis Suscripciones Activas</h2>
                            <a href="#" className="view-history">Ver Historial</a>
                        </div>
                        <table className="subs-table">
                            <thead>
                                <tr>
                                    <th>PLAN</th>
                                    <th>INVERTIDO</th>
                                    <th>GANANCIA TOTAL</th>
                                    <th>FECHA INICIO</th>
                                    <th>PROGRESO</th>
                                    <th>ESTADO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscriptions.map((sub, idx) => (
                                    <tr key={idx}>
                                        <td><strong>{sub.plan}</strong></td>
                                        <td>{sub.invested}</td>
                                        <td className="roi-positive">{sub.earning}</td>
                                        <td style={{ color: '#9CA3AF' }}>{sub.startDate}</td>
                                        <td>
                                            <div className="progress-bar-bg">
                                                <div className="progress-bar-fill" style={{ width: `${sub.progress}%` }}></div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${sub.status === 'En Curso' ? 'running' : 'completed'}`}>
                                                ● {sub.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Refer & Earn Section */}
                    <div className="bottom-grid">
                        <div className="referral-card">
                            <h2 className="section-title">Refiere y Gana Recompensas</h2>
                            <p className="section-subtitle" style={{ marginBottom: '16px' }}>
                                Comparte tu enlace único con amigos y gana el 5% de su primera inversión directamente en tu billetera.
                            </p>

                            <label className="stat-label">TU ENLACE DE REFERIDO</label>
                            <div className="referral-input-group">
                                <input
                                    type="text"
                                    value="https://financepro.app/ref/alex_sterling"
                                    readOnly
                                    className="referral-input"
                                />
                                <button className="copy-btn">📋</button>
                            </div>
                        </div>

                        <div className="stats-card-group">
                            <div className="stat-item">
                                <div className="stat-icon blue">👥</div>
                                <div className="stat-label">TOTAL REFERIDOS</div>
                                <div className="stat-value">24</div>
                                <div className="stat-trend positive">+3 esta semana</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon green">💵</div>
                                <div className="stat-label">GANANCIAS REFERIDOS</div>
                                <div className="stat-value" style={{ color: '#10B981' }}>$1,280.50</div>
                                <div className="stat-label">PAGADO A BILLETERA</div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Plans;
