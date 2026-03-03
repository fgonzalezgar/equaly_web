import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../dashboard/Dashboard.css';
import './BuyStocks.css';

// MOCK MODE - Set to true to test without backend
const MOCK_MODE = true;

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
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);

    const displayUser = {
        name: user?.user?.name || (user?.user?.first_name ? `${user.user.first_name} ${user.user.last_name || ''}`.trim() : user?.name || 'Cliente'),
        email: user?.user?.email || user?.email || ''
    };

    // Popular stocks data
    const popularStocks = [
        {
            symbol: 'AAPL',
            name: 'Apple Inc.',
            price: 189.45,
            change: 2.34,
            changePercent: 1.25,
            icon: '🍎',
            color: '#007AFF'
        },
        {
            symbol: 'MSFT',
            name: 'Microsoft Corp.',
            price: 415.20,
            change: -3.10,
            changePercent: -0.74,
            icon: '💻',
            color: '#00A4EF'
        },
        {
            symbol: 'GOOGL',
            name: 'Alphabet Inc.',
            price: 142.80,
            change: 1.85,
            changePercent: 1.31,
            icon: '🔍',
            color: '#4285F4'
        },
        {
            symbol: 'AMZN',
            name: 'Amazon.com Inc.',
            price: 132.70,
            change: 4.20,
            changePercent: 3.27,
            icon: '📦',
            color: '#FF9900'
        },
        {
            symbol: 'TSLA',
            name: 'Tesla Inc.',
            price: 238.45,
            change: -5.30,
            changePercent: -2.10,
            icon: '🚗',
            color: '#CC0000'
        },
        {
            symbol: 'NVDA',
            name: 'NVIDIA Corp.',
            price: 460.20,
            change: 15.60,
            changePercent: 3.40,
            icon: '🎮',
            color: '#76B900'
        },
        {
            symbol: 'META',
            name: 'Meta Platforms',
            price: 485.30,
            change: 8.45,
            changePercent: 1.77,
            icon: '📘',
            color: '#0866FF'
        },
        {
            symbol: 'NFLX',
            name: 'Netflix Inc.',
            price: 625.80,
            change: -2.15,
            changePercent: -0.34,
            icon: '🎬',
            color: '#E50914'
        }
    ];

    const cryptoAssets = [
        {
            symbol: 'BTC',
            name: 'Bitcoin',
            price: 64250.00,
            change: 2650.00,
            changePercent: 4.12,
            icon: '₿',
            color: '#F7931A'
        },
        {
            symbol: 'ETH',
            name: 'Ethereum',
            price: 2940.11,
            change: 53.45,
            changePercent: 1.85,
            icon: '⟠',
            color: '#627EEA'
        },
        {
            symbol: 'SOL',
            name: 'Solana',
            price: 108.67,
            change: -0.49,
            changePercent: -0.45,
            icon: '◎',
            color: '#00FFA3'
        }
    ];

    const handleStockSelect = (stock) => {
        setSelectedStock(stock);
    };

    // Mock successful response
    const mockSuccessfulPurchase = (purchaseData, total) => {
        const purchaseId = `PUR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`;

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    ok: true,
                    json: async () => ({
                        success: true,
                        message: "Compra registrada exitosamente",
                        purchase_id: purchaseId,
                        data: {
                            id: Math.floor(Math.random() * 1000),
                            ...purchaseData,
                            created_at: new Date().toISOString(),
                            payment_deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
                        },
                        payment_instructions: {
                            bank_name: "Banco YYYYYYYY",
                            account_number: "XXXX-XXXX-XXXX-XXXX",
                            account_type: "Ahorros",
                            account_holder: "EQUALY S.A.S",
                            total_amount: total,
                            currency: "USD",
                            deadline: "2 días",
                            reference: purchaseId
                        },
                        email_sent: true,
                        email_to: displayUser.email || "user@example.com"
                    })
                });
            }, 1500); // Simulate network delay
        });
    };

    const handleBuy = async () => {
        if (!selectedStock || !quantity) {
            alert('Por favor selecciona un activo y especifica la cantidad');
            return;
        }

        setIsSubmitting(true);
        setPurchaseSuccess(false);

        try {
            const total = selectedStock.price * parseFloat(quantity);
            const purchaseData = {
                asset_symbol: selectedStock.symbol,
                asset_name: selectedStock.name,
                asset_type: selectedStock.icon === '₿' || selectedStock.icon === '⟠' || selectedStock.icon === '◎' ? 'crypto' : 'stock',
                quantity: parseFloat(quantity),
                price: orderType === 'limit' && limitPrice ? parseFloat(limitPrice) : selectedStock.price,
                order_type: orderType,
                total_amount: total,
                status: 'pending'
            };

            let response;

            if (MOCK_MODE) {
                // Use mock response
                console.log('🧪 MOCK MODE: Simulating successful purchase');
                console.log('📤 Request Data:', JSON.stringify(purchaseData, null, 2));
                response = await mockSuccessfulPurchase(purchaseData, total);
            } else {
                // Real API call
                const token = localStorage.getItem('token');
                response = await fetch('https://api.equaly.co/purchases', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(purchaseData)
                });
            }

            if (!response.ok) {
                throw new Error('Error al procesar la compra');
            }

            const data = await response.json();
            console.log('📥 Response Data:', JSON.stringify(data, null, 2));

            setPurchaseSuccess(true);

            // Show detailed success message
            const bankDetails = data.payment_instructions;
            alert(
                `✅ Orden de Compra Registrada\n\n` +
                `Orden #: ${data.purchase_id}\n` +
                `Activo: ${selectedStock.symbol}\n` +
                `Cantidad: ${quantity}\n` +
                `Total: $${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}\n\n` +
                `📧 Se ha enviado un correo electrónico con las instrucciones de pago.\n\n` +
                `💳 INSTRUCCIONES DE PAGO:\n` +
                `Banco: ${bankDetails.bank_name}\n` +
                `Cuenta: ${bankDetails.account_number}\n` +
                `Titular: ${bankDetails.account_holder}\n` +
                `Referencia: ${bankDetails.reference}\n\n` +
                `⚠️ IMPORTANTE:\n` +
                `Tu transacción está PENDIENTE.\n` +
                `Debes realizar la consignación por el valor total dentro de 2 días.\n\n` +
                `Revisa tu correo para obtener todos los detalles.`
            );

            setQuantity('');
            setLimitPrice('');
            setSelectedStock(null);

        } catch (error) {
            console.error('Error al realizar la compra:', error);
            alert('❌ Error al procesar la compra. Por favor intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter stocks based on search term
    const allAssets = [...popularStocks, ...cryptoAssets];
    const filteredAssets = searchTerm
        ? allAssets.filter(asset =>
            asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : allAssets;

    return (
        <div className="dashboard-wrapper">
            {MOCK_MODE && (
                <div style={{
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    background: '#FFA500',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    zIndex: 9999,
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}>
                    🧪 MODO PRUEBA ACTIVO
                </div>
            )}

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
                                <a href="#" className="submenu-item">
                                    <span className="submenu-icon">📊</span>
                                    <span>Planes</span>
                                </a>
                                <a href="#" className="submenu-item">
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
                                className="search-input-large"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Stock Selector Dropdown */}
                        <div className="form-group">
                            <label className="form-label">Elegir Acción o Criptomoneda</label>
                            <select
                                className="stock-select"
                                value={selectedStock ? `${selectedStock.symbol}-${selectedStock.name}` : ''}
                                onChange={(e) => {
                                    const [symbol] = e.target.value.split('-');
                                    const stock = allAssets.find(s => s.symbol === symbol);
                                    handleStockSelect(stock);
                                }}
                            >
                                <option value="">-- Seleccionar --</option>
                                {filteredAssets.map((asset) => (
                                    <option
                                        key={asset.symbol}
                                        value={`${asset.symbol}-${asset.name}`}
                                    >
                                        {asset.symbol} - {asset.name} (${asset.price.toFixed(2)}) {asset.icon} {asset.changePercent > 0 ? '+' : ''}{asset.changePercent}%
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Selected Stock Display */}
                        {selectedStock && (
                            <div className="selected-stock-card" style={{ borderColor: selectedStock.color }}>
                                <div className="stock-card-icon" style={{ background: selectedStock.color }}>
                                    {selectedStock.icon}
                                </div>
                                <div className="stock-card-info">
                                    <h3>{selectedStock.symbol}</h3>
                                    <p>{selectedStock.name}</p>
                                </div>
                                <div className="stock-card-price">
                                    <div className="price-value">${selectedStock.price.toFixed(2)}</div>
                                    <div className={`price-change ${selectedStock.changePercent > 0 ? 'positive' : 'negative'}`}>
                                        {selectedStock.changePercent > 0 ? '↗' : '↘'} ${Math.abs(selectedStock.change).toFixed(2)} ({selectedStock.changePercent > 0 ? '+' : ''}{selectedStock.changePercent}%)
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Available vs Buying Power */}
                        {selectedStock && (
                            <div className="power-balance-grid">
                                <div className="balance-card">
                                    <div className="balance-label">Activos Disponibles</div>
                                    <div className="balance-value">11</div>
                                </div>
                                <div className="balance-card">
                                    <div className="balance-label">Poder de Compra</div>
                                    <div className="balance-value green">$12,300.00</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Configuration */}
                    {selectedStock && (
                        <div className="order-config-section">
                            <h2 className="section-title">Realizar Orden</h2>

                            {/* Asset Header (Compact) */}
                            <div className="order-asset-header">
                                <div className="asset-icon-small" style={{ background: selectedStock.color }}>
                                    {selectedStock.icon}
                                </div>
                                <div className="asset-header-info">
                                    <h3>{selectedStock.symbol}</h3>
                                    <p>{selectedStock.name}</p>
                                </div>
                                <div className="asset-price-big">${selectedStock.price.toFixed(2)}</div>
                            </div>

                            {/* Order Type Tabs */}
                            <div className="order-type-tabs">
                                <h3 className="subsection-title">Tipo de Orden</h3>
                                <div className="tab-buttons">
                                    <button
                                        className={`tab-btn ${orderType === 'market' ? 'active' : ''}`}
                                        onClick={() => setOrderType('market')}
                                    >
                                        Mercado
                                    </button>
                                    <button
                                        className={`tab-btn ${orderType === 'limit' ? 'active' : ''}`}
                                        onClick={() => setOrderType('limit')}
                                    >
                                        Límite
                                    </button>
                                </div>
                            </div>

                            {/* Quantity Input */}
                            <div className="form-group">
                                <label className="form-label">Cantidad</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Ingresa la cantidad de acciones"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    min="1"
                                    step="1"
                                />
                            </div>

                            {/* Limit Price (conditional) */}
                            {orderType === 'limit' && (
                                <div className="form-group">
                                    <label className="form-label">Precio Límite</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="Precio por acción"
                                        value={limitPrice}
                                        onChange={(e) => setLimitPrice(e.target.value)}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            )}

                            {/* Order Summary */}
                            {quantity && (
                                <div className="order-summary-card">
                                    <div className="summary-row">
                                        <span>Cantidad:</span>
                                        <strong>{quantity} {selectedStock.symbol}</strong>
                                    </div>
                                    <div className="summary-row">
                                        <span>Precio:</span>
                                        <strong>${(orderType === 'limit' && limitPrice ? parseFloat(limitPrice) : selectedStock.price).toFixed(2)}</strong>
                                    </div>
                                    <div className="summary-row total-row">
                                        <span>Total Estimado:</span>
                                        <strong className="total-amount">
                                            ${((orderType === 'limit' && limitPrice ? parseFloat(limitPrice) : selectedStock.price) * parseFloat(quantity)).toFixed(2)}
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
                                {isSubmitting ? '⏳ Procesando...' : `Comprar ${selectedStock.symbol}`}
                            </button>

                            {/* Disclaimer */}
                            <p className="disclaimer">
                                ⚠️ Invertir implica riesgos. Por favor, asegúrate de entender los riesgos antes de operar.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default BuyStocks;
