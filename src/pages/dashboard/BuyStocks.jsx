import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchPopularStocks } from '../../services/massiveAPI';
import '../dashboard/Dashboard.css';
import './BuyStocks.css';

const BuyStocks = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [portfolioOpen, setPortfolioOpen] = useState(true);
    const [selectedStock, setSelectedStock] = useState(null);
    const [orderType, setOrderType] = useState('market');
    const [quantity, setQuantity] = useState('');
    const [limitPrice, setLimitPrice] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [purchaseNotification, setPurchaseNotification] = useState(null);
    const [popularStocks, setPopularStocks] = useState([]);
    const [isLoadingStocks, setIsLoadingStocks] = useState(true);

    const displayUser = {
        name: user?.user?.name || (user?.user?.first_name ? `${user.user.first_name} ${user.user.last_name || ''}`.trim() : user?.name || 'Cliente'),
        email: user?.user?.email || user?.email || ''
    };

    // Fetch stocks from Massive API on component mount
    useEffect(() => {
        const loadStocks = async () => {
            setIsLoadingStocks(true);
            try {
                const stocks = await fetchPopularStocks();
                setPopularStocks(stocks);
            } catch (error) {
                console.error('Error loading stocks:', error);
                // Set empty array or fallback data
                setPopularStocks([]);
            } finally {
                setIsLoadingStocks(false);
            }
        };

        loadStocks();
    }, []);

    // Crypto assets - to be implemented with API later
    const cryptoAssets = [];

    const handleStockSelect = (stock) => {
        setSelectedStock(stock);
    };

    const handleBuy = () => {
        if (!selectedStock || !quantity) {
            alert('Por favor selecciona un activo y especifica la cantidad');
            return;
        }

        // Navigate to the checkout page instead of direct purchase
        navigate('/dashboard/buy/checkout', {
            state: {
                asset: selectedStock,
                quantity: parseFloat(quantity)
            }
        });
    };


    return (
        <>
            {/* Purchase Notification Banner */}
            {
                purchaseNotification && (
                    <div style={{
                        position: 'fixed',
                        top: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10000,
                        maxWidth: '600px',
                        width: '90%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                        animation: 'slideDown 0.5s ease-out',
                        color: 'white'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>✅</span>
                                    <span>¡Compra Pendiente de Confirmar!</span>
                                </div>
                                <div style={{ fontSize: '16px', marginBottom: '16px', opacity: 0.95 }}>
                                    <strong>📧 Revisa tu correo electrónico</strong>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                                        <div>
                                            <div style={{ opacity: 0.8, marginBottom: '4px' }}>ID de Compra:</div>
                                            <div style={{ fontWeight: 'bold' }}>#{purchaseNotification.purchaseId}</div>
                                        </div>
                                        <div>
                                            <div style={{ opacity: 0.8, marginBottom: '4px' }}>Activo:</div>
                                            <div style={{ fontWeight: 'bold' }}>{purchaseNotification.symbol}</div>
                                        </div>
                                        <div>
                                            <div style={{ opacity: 0.8, marginBottom: '4px' }}>Cantidad:</div>
                                            <div style={{ fontWeight: 'bold' }}>{purchaseNotification.quantity}</div>
                                        </div>
                                        <div>
                                            <div style={{ opacity: 0.8, marginBottom: '4px' }}>Total:</div>
                                            <div style={{ fontWeight: 'bold' }}>${purchaseNotification.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '14px', opacity: 0.9, lineHeight: '1.6' }}>
                                    ⏰ <strong>Fecha límite:</strong> {purchaseNotification.paymentDeadline}
                                    <br />
                                    💳 <strong>Estado:</strong> {purchaseNotification.status}
                                    <br />
                                    📬 Recibirás instrucciones de pago por correo electrónico
                                </div>
                            </div>
                            <button
                                onClick={() => setPurchaseNotification(null)}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginLeft: '12px',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )
            }
            <div className="dashboard-wrapper">
                {/* Sidebar - Same as Stocks page */}
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
                            <span>Market News</span>
                        </a>
                        <a href="#" className="nav-item">
                            <span className="nav-icon">📈</span>
                            <span>Advanced Charts</span>
                        </a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard/profile'); }} className="nav-item">
                            <span className="nav-icon">👤</span>
                            <span>Mi Perfil</span>
                        </a>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard/profile'); }} className="nav-item">
                            <span className="nav-icon">⚙️</span>
                            <span>Configuración</span>
                        </a>
                        <a href="#" className="nav-item">
                            <span className="nav-icon">🔔</span>
                            <span>Alerts</span>
                        </a>
                    </nav>

                    <div className="sidebar-footer">
                        <div className="user-profile">
                            <div className="user-avatar" onClick={() => navigate('/dashboard/profile')} style={{ cursor: 'pointer' }}>
                                {displayUser.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-info" onClick={() => navigate('/dashboard/profile')} style={{ cursor: 'pointer' }}>
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
                        <h1 className="page-title-header">Comprar Acciones y Criptomonedas</h1>
                        <div className="topbar-right">
                            <div className="buying-power-display">
                                💰 Poder de Compra: <strong>$12,300.00</strong>
                            </div>
                            <button
                                className="btn-back"
                                onClick={() => navigate('/dashboard/stocks')}
                            >
                                ← Volver al Portafolio
                            </button>
                        </div>
                    </header>

                    <div className="buy-stocks-content">
                        {/* Stock Selection Form */}
                        <div className="stock-selection-section">
                            <h2 className="section-title">Seleccionar Activo para Comprar</h2>

                            {/* Search/Filter Input */}
                            <div className="search-box-large">
                                <span className="search-icon">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Buscar acciones por símbolo o nombre..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input-large"
                                />
                            </div>

                            {/* Stock Dropdown Select */}
                            <div className="stock-select-container">
                                <label className="select-label">Elegir Acción o Criptomoneda</label>
                                <select
                                    className="stock-select"
                                    value={selectedStock?.symbol || ''}
                                    onChange={(e) => {
                                        const stock = [...popularStocks, ...cryptoAssets].find(s => s.symbol === e.target.value);
                                        handleStockSelect(stock);
                                    }}
                                >
                                    <option value="">{isLoadingStocks ? '⏳ Cargando acciones...' : '-- Seleccionar un activo --'}</option>

                                    <optgroup label="📈 Acciones Populares">
                                        {popularStocks
                                            .filter(stock =>
                                                searchTerm === '' ||
                                                stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                stock.name.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map((stock) => (
                                                <option key={stock.symbol} value={stock.symbol}>
                                                    {stock.symbol} - {stock.name} (${stock.price.toFixed(2)}) {stock.change >= 0 ? '↗' : '↘'} {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                                                </option>
                                            ))
                                        }
                                    </optgroup>

                                    <optgroup label="₿ Criptomonedas">
                                        {cryptoAssets
                                            .filter(crypto =>
                                                searchTerm === '' ||
                                                crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map((crypto) => (
                                                <option key={crypto.symbol} value={crypto.symbol}>
                                                    {crypto.symbol} - {crypto.name} (${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}) {crypto.change >= 0 ? '↗' : '↘'} {crypto.changePercent >= 0 ? '+' : ''}{crypto.changePercent}%
                                                </option>
                                            ))
                                        }
                                    </optgroup>
                                </select>
                            </div>

                            {/* Selected Stock Preview */}
                            {selectedStock && (
                                <div className="selected-stock-preview">
                                    <div className="preview-header">
                                        <span className="preview-icon" style={{ background: selectedStock.color }}>
                                            {selectedStock.icon}
                                        </span>
                                        <div className="preview-info">
                                            <div className="preview-symbol">{selectedStock.symbol}</div>
                                            <div className="preview-name">{selectedStock.name}</div>
                                        </div>
                                    </div>
                                    <div className="preview-price-section">
                                        <div className="preview-current-price">
                                            ${selectedStock.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </div>
                                        <div className={`preview-change ${selectedStock.change >= 0 ? 'positive' : 'negative'}`}>
                                            {selectedStock.change >= 0 ? '↗' : '↘'} ${Math.abs(selectedStock.change).toFixed(2)} ({selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent}%)
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Quick Stats */}
                            <div className="quick-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Activos Disponibles</span>
                                    <span className="stat-value">{popularStocks.length + cryptoAssets.length}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Poder de Compra</span>
                                    <span className="stat-value positive">$12,300.00</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Order Form */}
                        <div className="order-form-section">
                            {selectedStock ? (
                                <div className="order-form-card">
                                    <h2>Realizar Orden</h2>

                                    {/* Selected Stock Info */}
                                    <div className="selected-stock-info">
                                        <span className="stock-icon-selected" style={{ background: selectedStock.color }}>
                                            {selectedStock.icon}
                                        </span>
                                        <div>
                                            <div className="selected-symbol">{selectedStock.symbol}</div>
                                            <div className="selected-name">{selectedStock.name}</div>
                                        </div>
                                        <div className="selected-price">
                                            ${selectedStock.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>

                                    {/* Order Type Selector */}
                                    <div className="form-group">
                                        <label>Tipo de Orden</label>
                                        <div className="order-type-selector">
                                            <button
                                                className={`order-type-btn ${orderType === 'market' ? 'active' : ''}`}
                                                onClick={() => setOrderType('market')}
                                            >
                                                Mercado
                                            </button>
                                            <button
                                                className={`order-type-btn ${orderType === 'limit' ? 'active' : ''}`}
                                                onClick={() => setOrderType('limit')}
                                            >
                                                Límite
                                            </button>
                                        </div>
                                    </div>

                                    {/* Quantity Input */}
                                    <div className="form-group">
                                        <label>Cantidad</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            placeholder="Ingresar cantidad"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>

                                    {/* Limit Price (if limit order) */}
                                    {orderType === 'limit' && (
                                        <div className="form-group">
                                            <label>Precio Límite</label>
                                            <input
                                                type="number"
                                                className="form-input"
                                                placeholder="Ingresar precio límite"
                                                value={limitPrice}
                                                onChange={(e) => setLimitPrice(e.target.value)}
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    )}

                                    {/* Order Summary */}
                                    {quantity && (
                                        <div className="order-summary">
                                            <div className="summary-row">
                                                <span>Cantidad:</span>
                                                <strong>{quantity} {selectedStock.symbol}</strong>
                                            </div>
                                            <div className="summary-row">
                                                <span>Precio:</span>
                                                <strong>${orderType === 'limit' && limitPrice ? parseFloat(limitPrice).toFixed(2) : selectedStock.price.toFixed(2)}</strong>
                                            </div>
                                            <div className="summary-row total">
                                                <span>Total Estimado:</span>
                                                <strong className="total-amount">
                                                    ${(selectedStock.price * parseFloat(quantity)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </strong>
                                            </div>
                                        </div>
                                    )}

                                    {/* Buy Button */}
                                    <button
                                        className="btn-buy-large"
                                        onClick={handleBuy}
                                        disabled={!quantity || isSubmitting}
                                    >
                                        {isSubmitting ? '⏳ Procesando...' : `💰 Continuar al Pago`}
                                    </button>

                                    {/* Disclaimer */}
                                    <p className="disclaimer">
                                        ⚠️ Invertir implica riesgos. Por favor, asegúrate de entender los riesgos antes de operar.
                                    </p>
                                </div>
                            ) : (
                                <div className="order-form-card empty">
                                    <div className="empty-state">
                                        <div className="empty-icon">📊</div>
                                        <h3>Seleccionar una Acción</h3>
                                        <p>Elige una acción o criptomoneda de la lista para realizar una orden</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default BuyStocks;
