import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';
import './Profile.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [portfolioOpen, setPortfolioOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    // Display user data
    const displayUser = {
        name: user?.user?.name || (user?.user?.first_name ? `${user.user.first_name} ${user.user.last_name || ''}`.trim() : user?.name || 'Cliente'),
        firstName: user?.user?.first_name || user?.user?.nombres || user?.name?.split(' ')[0] || '',
        lastName: user?.user?.last_name || user?.user?.apellidos || user?.name?.split(' ')[1] || '',
        email: user?.user?.email || user?.email || '',
        country: user?.user?.country || 'Ecuador',
        referralCode: user?.user?.referral_code || user?.user?.id || 'REF' + (user?.user?.id || '001'),
        status: 'Cuenta Premium'
    };

    // Referral URL Construction (using current domain)
    const referralUrl = user?.user?.referral_url || `${window.location.origin}/registro?ref=${displayUser.referralCode}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <div className="dashboard-wrapper">
            {/* Sidebar (Replicated for consistency) */}
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
                                    className="submenu-item"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/dashboard/currencies');
                                    }}
                                >
                                    <span className="submenu-icon">💱</span>
                                    <span>Divisas</span>
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
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard/profile'); }} className="nav-item active">
                        <span className="nav-icon">👤</span>
                        <span>Mi Perfil</span>
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
                            <div className="user-status">{displayUser.status}</div>
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
                        <h1 className="page-title">Mi Perfil</h1>
                    </div>
                    <div className="topbar-right">
                        <button className="dark-mode-toggle">🔔</button>
                    </div>
                </header>

                <div className="content-area profile-container">
                    <div className="profile-grid">
                        {/* Profile Summary Card */}
                        <div className="card profile-sidebar-card">
                            <div className="profile-avatar-large">
                                {displayUser.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="profile-name-large">{displayUser.firstName} {displayUser.lastName}</h2>
                            <p className="profile-email-large">{displayUser.email}</p>
                            <span className="profile-status-badge">● {displayUser.status}</span>

                            <div className="profile-stats-mini">
                                <div className="mini-stat-item">
                                    <div className="mini-stat-label">Nivel</div>
                                    <div className="mini-stat-value">ORO</div>
                                </div>
                                <div className="mini-stat-item" style={{ borderLeft: '1px solid #374151', borderRight: '1px solid #374151', padding: '0 15px' }}>
                                    <div className="mini-stat-label">Referidos</div>
                                    <div className="mini-stat-value">12</div>
                                </div>
                                <div className="mini-stat-item">
                                    <div className="mini-stat-label">Capital</div>
                                    <div className="mini-stat-value">$2.5k</div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Details Form */}
                        <div className="card">
                            <h3 className="section-title-small">Información de la Cuenta</h3>
                            <div className="profile-form">
                                <div className="form-group">
                                    <label>Nombres</label>
                                    <input type="text" value={displayUser.firstName} disabled />
                                </div>
                                <div className="form-group">
                                    <label>Apellidos</label>
                                    <input type="text" value={displayUser.lastName} disabled />
                                </div>
                                <div className="form-group">
                                    <label>Correo Electrónico</label>
                                    <input type="email" value={displayUser.email} disabled />
                                </div>
                                <div className="form-group">
                                    <label>País</label>
                                    <input type="text" value={displayUser.country} disabled />
                                </div>
                            </div>

                            {/* Referral Section */}
                            <div className="referral-section" style={{ marginTop: '30px' }}>
                                <h3 className="section-title-small" style={{ marginBottom: '10px' }}>Sistema de Referidos</h3>
                                <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '20px' }}>
                                    Comparte tu enlace de referido y gana comisiones por cada inversión que realicen tus amigos.
                                </p>
                                <div className="referral-card-content">
                                    <label style={{ display: 'block', fontSize: '11px', color: '#3B82F6', fontWeight: '700', marginBottom: '8px' }}>TU ENLACE PERSONAL</label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input
                                            type="text"
                                            value={referralUrl}
                                            readOnly
                                            style={{
                                                flex: 1,
                                                background: '#050511',
                                                border: '1px solid #374151',
                                                borderRadius: '8px',
                                                padding: '10px 15px',
                                                color: 'white',
                                                fontFamily: 'monospace',
                                                fontSize: '13px'
                                            }}
                                        />
                                        <button
                                            onClick={handleCopyLink}
                                            style={{
                                                background: '#3B82F6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                padding: '0 15px',
                                                cursor: 'pointer',
                                                fontWeight: '600'
                                            }}
                                        >
                                            {copySuccess ? '¡Copiado!' : 'Copiar'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button className="btn-update">Actualizar Perfil (Próximamente)</button>
                        </div>
                    </div>
                </div>
            </main>

            {copySuccess && <div className="copy-success-toast">¡Enlace copiado al portapapeles!</div>}
        </div>
    );
};

export default Profile;
