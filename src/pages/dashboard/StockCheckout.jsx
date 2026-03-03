import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './PlanCheckout.css'; // Reusing the same styles

const StockCheckout = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const asset = location.state?.asset;
    const initialQuantity = location.state?.quantity || 1;

    const [step, setStep] = useState('form');
    const [amount, setAmount] = useState(asset ? (asset.price * initialQuantity).toFixed(2) : '0');
    const [quantity, setQuantity] = useState(initialQuantity);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);

    // Redirect if no asset selected
    useEffect(() => {
        if (!asset && !location.search.includes('session_id')) {
            navigate('/dashboard/buy');
        }
    }, [asset, navigate, location.search]);

    // Check for Stripe return
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const sessionId = queryParams.get('session_id');

        if (sessionId && step !== 'success') {
            const confirmPayment = async () => {
                try {
                    let token = localStorage.getItem('token');
                    if (!token) {
                        const userData = JSON.parse(localStorage.getItem('equaly_user'));
                        token = userData?.token;
                    }

                    const response = await fetch('https://equaly-api.vercel.app/api/investments/confirm', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ stripePaymentId: sessionId })
                    });

                    if (response.ok) {
                        setStep('success');
                    } else {
                        alert('No se pudo confirmar automáticamente su pago con el servidor.');
                        setStep('success');
                    }
                } catch (e) {
                    console.error('Error confirming payment:', e);
                }
            };
            confirmPayment();
        }
    }, [location.search, step]);

    useEffect(() => {
        if (asset && quantity) {
            setAmount((asset.price * quantity).toFixed(2));
        }
    }, [quantity, asset]);

    const handleStripeCheckout = async (e) => {
        e.preventDefault();
        setIsCalculating(true);
        try {
            let token = localStorage.getItem('token');
            if (!token) {
                const userData = JSON.parse(localStorage.getItem('equaly_user'));
                token = userData?.token;
            }

            // NOTE: Using planId: 99 as a placeholder for "Custom/Stock Investment" 
            // the backend might need to be updated to handle types of assets
            const response = await fetch('https://equaly-api.vercel.app/api/investments/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    planId: 1, // Using plan 1 (Oro) as placeholder for now since it's the most flexible
                    amount: parseFloat(amount),
                    paymentMethod: 'Tarjeta Débito'
                })
            });

            const textResponse = await response.text();
            let data;

            try {
                data = JSON.parse(textResponse);
            } catch (jsonError) {
                throw new Error('Error de conexión con el servidor de pagos.');
            }

            if (response.ok && data.data?.checkoutUrl) {
                window.location.href = data.data.checkoutUrl;
            } else {
                throw new Error(data.message || 'Error al conectar con la pasarela de pago');
            }
        } catch (error) {
            console.error('Error in Stripe Checkout:', error);
            alert(error.message);
        } finally {
            setIsCalculating(false);
        }
    };

    if (!asset && step !== 'success') return null;

    const displayUser = {
        name: user?.user?.name || (user?.user?.first_name ? `${user.user.first_name} ${user.user.last_name || ''}`.trim() : user?.name || 'Cliente'),
        email: user?.user?.email || user?.email || ''
    };

    return (
        <div className="dashboard-wrapper">
            <main className="main-content" style={{ padding: '0' }}>
                <header className="topbar" style={{ padding: '20px 32px', borderBottom: '1px solid #1f2937' }}>
                    <div className="checkout-header-nav">
                        <button className="back-btn" onClick={() => navigate('/dashboard/buy')}>←</button>
                        <h1 className="page-title-header">Completar Compra de Activo</h1>
                    </div>
                    <div className="topbar-right">
                        <div className="user-profile-top">
                            <span className="user-name-co">{displayUser.name}</span>
                        </div>
                    </div>
                </header>

                <div className="content-area checkout-wrapper">
                    {step === 'form' && (
                        <>
                            {/* Left Column: Asset Info */}
                            <div className="checkout-left">
                                <div className="selected-plan-card">
                                    <span className="selected-label">Activo Seleccionado</span>
                                    <h2 className="selected-plan-title">{asset.symbol}</h2>
                                    <p style={{ color: '#9CA3AF', marginBottom: '24px' }}>{asset.name}</p>

                                    <div className="plan-stats-grid">
                                        <div className="plan-stat-row">
                                            <span className="stat-icon-label">💰 Precio Actual</span>
                                            <span className="stat-value-co">${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="plan-stat-row">
                                            <span className="stat-icon-label">📊 Cambio (24h)</span>
                                            <span className={`stat-value-co ${asset.change >= 0 ? 'highlight' : 'negative'}`} style={{ color: asset.change >= 0 ? '#10B981' : '#EF4444' }}>
                                                {asset.change >= 0 ? '+' : ''}{asset.changePercent}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="plan-range-row">
                                        <span className="range-label">Total Estimado</span>
                                        <span className="range-value" style={{ fontSize: '20px', color: '#3B82F6' }}>
                                            ${(parseFloat(amount)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>

                                <div className="expert-tip-box">
                                    <span className="tip-icon">ℹ️</span>
                                    <div className="tip-content">
                                        <h4>Nota de Mercado</h4>
                                        <p>Los precios de las acciones pueden variar ligeramente entre el momento de la orden y la ejecución final.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Payment Form */}
                            <div className="checkout-right">
                                <form className="investment-form-card" onSubmit={handleStripeCheckout}>
                                    <h3 className="form-title">Configurar Compra</h3>

                                    <div className="form-group">
                                        <label className="form-label">Cantidad a Comprar</label>
                                        <div className="amount-input-wrapper">
                                            <input
                                                type="number"
                                                className="amount-input"
                                                value={quantity}
                                                onChange={(e) => setQuantity(e.target.value)}
                                                min="0.01"
                                                step="0.01"
                                                required
                                            />
                                        </div>
                                        <div className="amount-limits">
                                            <span>Mín: 0.01</span>
                                            <span>Total: ${(parseFloat(amount)).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</span>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Método de Pago</label>
                                        <div className="payment-methods-grid">
                                            <div
                                                className={`payment-method-card ${paymentMethod === 'card' ? 'active' : ''}`}
                                                onClick={() => setPaymentMethod('card')}
                                            >
                                                <span className="pm-icon">💳</span>
                                                <span className="pm-name">Tarjeta Débito</span>
                                            </div>
                                            <div
                                                className={`payment-method-card ${paymentMethod === 'wallet' ? 'active' : ''}`}
                                                onClick={() => setPaymentMethod('wallet')}
                                            >
                                                <span className="pm-icon">👛</span>
                                                <span className="pm-name">Saldo Billetera</span>
                                            </div>
                                            <div
                                                className={`payment-method-card ${paymentMethod === 'crypto' ? 'active' : ''}`}
                                                onClick={() => setPaymentMethod('crypto')}
                                            >
                                                <span className="pm-icon">₿</span>
                                                <span className="pm-name">Cripto</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="terms-checkbox">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            checked={termsAccepted}
                                            onChange={(e) => setTermsAccepted(e.target.checked)}
                                            required
                                        />
                                        <label htmlFor="terms" className="terms-text">
                                            Confirmo que he leído y acepto la <a href="#" className="link">Política de Inversión</a> y los <a href="#" className="link">Términos de Servicio</a>.
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="confirm-btn"
                                        disabled={!termsAccepted || isCalculating}
                                    >
                                        {isCalculating ? '⏳ Procesando...' : '💳 Procesar Pago Seguro'}
                                    </button>

                                    <div className="encryption-note">
                                        🔒 Pago Encriptado de Punto a Punto con Stripe
                                    </div>
                                </form>
                            </div>
                        </>
                    )}

                    {step === 'success' && (
                        <div className="success-container-full" style={{ width: '100%' }}>
                            <div className="success-card-center">
                                <div className="success-icon-box">🎉</div>
                                <h2 className="success-title">¡Compra Procesada!</h2>
                                <p className="success-message">
                                    Tu orden de compra ha sido recibida y se encuentra en proceso de ejecución.
                                    Verás los activos reflejados en tu portafolio en unos momentos.
                                </p>

                                <div className="success-details">
                                    <div className="detail-row">
                                        <span>Activo:</span>
                                        <strong>{asset?.symbol || 'Acción'}</strong>
                                    </div>
                                    <div className="detail-row">
                                        <span>Cantidad:</span>
                                        <strong>{quantity} unidades</strong>
                                    </div>
                                    <div className="detail-row">
                                        <span>Total Pagado:</span>
                                        <strong>${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</strong>
                                    </div>
                                    <div className="detail-row">
                                        <span>Estado:</span>
                                        <strong style={{ color: '#10B981' }}>Completado</strong>
                                    </div>
                                </div>

                                <button className="dashboard-btn" onClick={() => navigate('/dashboard/stocks')}>
                                    Volver a mi Portafolio
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StockCheckout;
