import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as changeNowService from '../../services/changeNowService';
import './Dashboard.css';
import './PlanCheckout.css';

const PlanCheckout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [portfolioOpen, setPortfolioOpen] = useState(true);

    // Flow State: 'form' | 'payment-console' | 'success'
    const [step, setStep] = useState('form');
    const [showCardWidget, setShowCardWidget] = useState(false);

    // Form state
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('wallet');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [calculations, setCalculations] = useState({ return: 0, date: '' });

    // Crypto State
    const [currencies, setCurrencies] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState('btc');
    const [cryptoEstimate, setCryptoEstimate] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);

    // Transaction State
    const [transactionData, setTransactionData] = useState(null);
    const [txStatus, setTxStatus] = useState('new'); // new, waiting, confirming, exchanging, sending, finished, failed
    const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes in seconds

    const plan = location.state?.plan;
    const pollingInterval = useRef(null);
    const timerInterval = useRef(null);

    // Redirect if no plan selected
    useEffect(() => {
        if (!plan && !location.search.includes('session_id')) {
            navigate('/dashboard/plans');
        }
    }, [plan, navigate, location.search]);

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
                        // Error confirming, fallback
                        alert('No se pudo confirmar automáticamente su pago con el servidor, sin embargo Stripe procesó la solicitud.');
                        setStep('success');
                    }
                } catch (e) {
                    console.error('Error confirming payment:', e);
                }
            };
            confirmPayment();
        }
    }, [location.search, step]);

    // Load available currencies
    useEffect(() => {
        const loadCurrencies = async () => {
            const coins = await changeNowService.getAvailableCurrencies();
            setCurrencies(coins);
        };
        loadCurrencies();
    }, []);

    // Cleanup intervals
    useEffect(() => {
        return () => {
            if (pollingInterval.current) clearInterval(pollingInterval.current);
            if (timerInterval.current) clearInterval(timerInterval.current);
        };
    }, []);

    // Calculate returns
    useEffect(() => {
        if (plan && amount) {
            const numAmount = parseFloat(amount);
            if (!isNaN(numAmount)) {
                const roiRate = parseFloat(plan.roi.replace('%', '')) / 100;
                const durationDays = parseInt(plan.duration.split(' ')[0]);
                const totalReturn = numAmount + (numAmount * roiRate * durationDays);

                const date = new Date();
                date.setDate(date.getDate() + durationDays);
                const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                const formattedDate = `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;

                // eslint-disable-next-line react-hooks/set-state-in-effect
                setCalculations({
                    return: totalReturn.toFixed(2),
                    date: formattedDate
                });
            } else {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setCalculations({ return: 0, date: '-' });
            }
        }
    }, [amount, plan]);

    // Calculate Crypto Estimate
    useEffect(() => {
        if (paymentMethod === 'crypto' && amount && selectedCoin && step === 'form') {
            const getEstimate = async () => {
                setIsCalculating(true);
                const estimate = await changeNowService.getEstimatedAmount(selectedCoin, parseFloat(amount));
                setCryptoEstimate(estimate);
                setIsCalculating(false);
            };

            const timer = setTimeout(getEstimate, 500);
            return () => clearTimeout(timer);
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCryptoEstimate(null);
        }
    }, [amount, selectedCoin, paymentMethod, step]);

    // Polling Logic
    const startPolling = (txId) => {
        if (pollingInterval.current) clearInterval(pollingInterval.current);

        pollingInterval.current = setInterval(async () => {
            try {
                const statusData = await changeNowService.getTransactionStatus(txId);
                console.log('Transaction Status:', statusData);

                if (statusData && statusData.status) {
                    setTxStatus(statusData.status);

                    if (statusData.status === 'finished') {
                        clearInterval(pollingInterval.current);
                        clearInterval(timerInterval.current);
                        setStep('success');
                    } else if (['failed', 'refunded', 'expired'].includes(statusData.status)) {
                        clearInterval(pollingInterval.current);
                        clearInterval(timerInterval.current);
                        alert(`La transacción ha fallado: ${statusData.status}`);
                        setStep('form');
                    }
                }
            } catch (error) {
                console.error("Error checking status", error);
            }
        }, 5000); // Check every 5 seconds
    };

    const handleCreateTransaction = async () => {
        if (!amount || !selectedCoin || !cryptoEstimate) return;

        setIsCalculating(true);
        const tx = await changeNowService.createTransaction(selectedCoin, cryptoEstimate.estimatedAmount);

        if (tx && tx.payinAddress) {
            setTransactionData(tx);
            setTxStatus('waiting');
            setStep('payment-console');
            setIsCalculating(false);

            // Start Polling
            startPolling(tx.id);

            // Start Timer
            setTimeLeft(1200); // Reset to 20 mins
            if (timerInterval.current) clearInterval(timerInterval.current);
            timerInterval.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerInterval.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } else {
            alert('Error al generar la transacción. Por favor intente nuevamente.');
            setIsCalculating(false);
        }
    };

    const handleConfirm = (e) => {
        e.preventDefault();

        if (paymentMethod === 'wallet') {
            console.log('Investing with Wallet:', { plan: plan.name, amount });
            setStep('success'); // Simulate instant success for wallet
        } else if (paymentMethod === 'crypto') {
            handleCreateTransaction();
        }
    };

    const handleStripeCheckout = async (e) => {
        e.preventDefault();
        setIsCalculating(true);
        try {
            let token = localStorage.getItem('token');
            if (!token) {
                const userData = JSON.parse(localStorage.getItem('equaly_user'));
                token = userData?.token;
            }
            const response = await fetch('https://equaly-api.vercel.app/api/investments/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    planId: plan.id,
                    amount: parseFloat(amount),
                    paymentMethod: 'Tarjeta Débito'
                })
            });

            const textResponse = await response.text();
            let data;

            try {
                data = JSON.parse(textResponse);
            } catch (jsonError) {
                console.error('Non-JSON response from server:', textResponse);
                throw new Error('Error de conexión o fallo interno en el servidor. Por favor intenta de nuevo.');
            }

            if (response.ok && data.checkoutUrl) {
                // Redirigir al usuario al Stripe Checkout
                window.location.href = data.checkoutUrl;
            } else {
                throw new Error(data.message || (data.errors ? Object.values(data.errors).flat().join(', ') : 'Error al conectar con la pasarela de pago'));
            }
        } catch (error) {
            console.error('Error in Stripe Checkout:', error);
            alert(error.message);
        } finally {
            setIsCalculating(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const getStatusStepObj = (status) => {
        // defined steps: 0=waiting, 1=confirming, 2=exchanging, 3=finished
        let stepIndex = 0;
        switch (status) {
            case 'new': stepIndex = 0; break;
            case 'waiting': stepIndex = 0; break;
            case 'confirming': stepIndex = 1; break;
            case 'exchanging': stepIndex = 2; break;
            case 'sending': stepIndex = 2; break;
            case 'finished': stepIndex = 3; break;
            default: stepIndex = 0;
        }
        return stepIndex;
    };

    if (!plan && step !== 'success') return null;

    const displayUser = {
        name: user?.user?.name || (user?.user?.first_name ? `${user.user.first_name} ${user.user.last_name || ''}`.trim() : user?.name || 'Cliente'),
        email: user?.user?.email || user?.email || ''
    };

    return (
        <div className="dashboard-wrapper">
            {/* Sidebar (same as before) */}
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
                        <a href="#" className={`nav-item ${portfolioOpen ? 'open' : ''}`} onClick={(e) => { e.preventDefault(); setPortfolioOpen(!portfolioOpen); }}>
                            <span className="nav-icon">💼</span>
                            <span>Portafolio</span>
                            <span className="nav-arrow">{portfolioOpen ? '▼' : '▶'}</span>
                        </a>
                        {portfolioOpen && (
                            <div className="submenu">
                                <a href="#" className="submenu-item" onClick={(e) => { e.preventDefault(); navigate('/dashboard/stocks'); }}><span className="submenu-icon">📈</span><span>Acciones</span></a>
                                <a href="#" className="submenu-item active" onClick={(e) => { e.preventDefault(); navigate('/dashboard/plans'); }}><span className="submenu-icon">📋</span><span>Planes</span></a>
                                <a href="#" className="submenu-item" onClick={(e) => { e.preventDefault(); navigate('/dashboard/currencies'); }}><span className="submenu-icon">💱</span><span>Divisas</span></a>
                                <a href="#" className="submenu-item"><span className="submenu-icon">₿</span><span>Criptomonedas</span></a>
                            </div>
                        )}
                    </div>
                    <a href="#" className="nav-item"><span className="nav-icon">📰</span><span>Noticias del Mercado</span></a>
                    <a href="#" className="nav-item"><span className="nav-icon">📈</span><span>Gráficos Avanzados</span></a>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">{displayUser.name.charAt(0).toUpperCase()}</div>
                        <div className="user-info">
                            <div className="user-name">{displayUser.name}</div>
                            <div className="user-status">Cuenta Premium</div>
                        </div>
                        <button onClick={() => { logout(); navigate('/login'); }} className="logout-icon" title="Cerrar sesión">⎋</button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="topbar">
                    <div className="checkout-header-nav" style={{ width: '100%' }}>
                        <button className="back-btn" onClick={() => navigate('/dashboard/plans')}>←</button>
                        <h1 className="page-title" style={{ margin: 0 }}>
                            {step === 'form' ? 'Confirmar Inversión' : step === 'payment-console' ? 'Procesando Pago' : 'Inversión Exitosa'}
                        </h1>
                        <div className="wallet-balance" style={{ marginLeft: 'auto' }}>
                            <span>SALDO BILLETERA</span>
                            <span style={{ color: '#10B981' }}>$12,450.00</span>
                        </div>
                    </div>
                    <div className="topbar-right">
                        <button className="dark-mode-toggle">🔔</button>
                    </div>
                </header>

                <div className="content-area checkout-wrapper">

                    {/* CARD WIDGET MODAL */}
                    {showCardWidget && (
                        <div className="card-widget-overlay">
                            <div className="card-widget-modal">
                                <button className="close-widget-btn" onClick={() => setShowCardWidget(false)}>✕</button>
                                <iframe
                                    src={changeNowService.getWidgetUrl(amount)}
                                    title="ChangeNow Card Payment"
                                    className="changenow-iframe"
                                    allow="camera; microphone; payment"
                                ></iframe>
                                <div className="widget-footer">
                                    <p>Su pago es procesado de forma segura por ChangeNow.</p>
                                    <button
                                        className="btn-complete-manual"
                                        onClick={() => {
                                            if (window.confirm('¿Ha completado el pago exitosamente?')) {
                                                setShowCardWidget(false);
                                                setStep('success'); // In real app, we verify webhook
                                            }
                                        }}
                                    >
                                        He completado el pago
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'form' && (
                        <>
                            {/* Left Column */}
                            <div className="checkout-left">
                                <div className="selected-plan-card">
                                    <div className="selected-plan-header">
                                        <div>
                                            <span className="selected-label">PLAN SELECCIONADO</span>
                                            <h2 className="selected-plan-title">Plan {plan.name}</h2>
                                        </div>
                                        <span className={`plan-tier tier-${plan.tier.toLowerCase()}`}>{plan.tier}</span>
                                    </div>
                                    <div className="plan-stats-grid">
                                        <div className="plan-stat-row">
                                            <div className="stat-icon-label"><span>📈</span><span>ROI Diario</span></div>
                                            <span className="stat-value-co highlight">{plan.roi}</span>
                                        </div>
                                        <div className="plan-stat-row">
                                            <div className="stat-icon-label"><span>🕒</span><span>Duración</span></div>
                                            <span className="stat-value-co">{plan.duration}</span>
                                        </div>
                                        <div className="plan-stat-row">
                                            <div className="stat-icon-label"><span>🔓</span><span>Retiros</span></div>
                                            <span className="stat-value-co">En cualquier momento</span>
                                        </div>
                                    </div>
                                    <div className="plan-range-row">
                                        <span className="range-label">Rango del Plan</span>
                                        <span className="range-value">${plan.min.toLocaleString()} — ${plan.max.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="expert-tip-box">
                                    <span className="tip-icon">ℹ️</span>
                                    <div className="tip-content">
                                        <h4>Consejo de Experto</h4>
                                        <p>El rendimiento histórico promedio de los planes {plan.name} es muy estable. Considere reinvertir sus ganancias diariamente.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column (Form) */}
                            <div className="checkout-right">
                                <div className="investment-form-card">
                                    <h3 className="form-title">Completar Inversión</h3>

                                    <div className="form-group">
                                        <label className="form-label">Monto a Invertir</label>
                                        <div className="amount-input-wrapper">
                                            <span className="currency-symbol">$</span>
                                            <input type="number" className="amount-input" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} min={plan.min} max={plan.max} />
                                        </div>
                                        <div className="amount-limits">
                                            <span>MÍN: ${plan.min.toLocaleString()}</span>
                                            <span>MÁX: ${plan.max.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Método de Pago</label>
                                        <div className="payment-methods-grid">
                                            <div className={`payment-method-card ${paymentMethod === 'wallet' ? 'active' : ''}`} onClick={() => setPaymentMethod('wallet')}>
                                                <span className="pm-icon">👛</span><span className="pm-name">Saldo Billetera</span>
                                            </div>
                                            <div className={`payment-method-card ${paymentMethod === 'crypto' ? 'active' : ''}`} onClick={() => setPaymentMethod('crypto')}>
                                                <span className="pm-icon">₿</span><span className="pm-name">Criptomonedas</span>
                                            </div>
                                            <div className={`payment-method-card ${paymentMethod === 'card' ? 'active' : ''}`} onClick={() => setPaymentMethod('card')}>
                                                <span className="pm-icon">💳</span><span className="pm-name">Tarjeta Débito</span>
                                            </div>
                                        </div>
                                    </div>

                                    {paymentMethod === 'crypto' && (
                                        <div className="crypto-section">
                                            <label className="form-label">Seleccionar Criptomoneda</label>
                                            <select className="crypto-select" value={selectedCoin} onChange={(e) => setSelectedCoin(e.target.value)}>
                                                {currencies.map(coin => (
                                                    <option key={coin.ticker} value={coin.ticker}>{coin.name} ({coin.ticker.toUpperCase()})</option>
                                                ))}
                                            </select>
                                            <div className="crypto-estimate-box">
                                                {isCalculating ? <div className="loading-spinner-small">Calculando...</div> : cryptoEstimate ? (
                                                    <>
                                                        <div className="estimate-label">Total a pagar en {selectedCoin.toUpperCase()}:</div>
                                                        <div className="estimate-amount">{cryptoEstimate.estimatedAmount} {selectedCoin.toUpperCase()}</div>
                                                        <div className="estimate-sub">1 {selectedCoin.toUpperCase()} ≈ {cryptoEstimate.rate} USDT</div>
                                                    </>
                                                ) : (<div className="estimate-placeholder">Ingrese un monto para ver el estimado</div>)}
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === 'card' && (
                                        <div className="card-section">
                                            <p className="card-instructions">
                                                Use su tarjeta de crédito o débito para completar la inversión de forma segura.
                                                El proceso se abrirá en una ventana emergente.
                                            </p>
                                        </div>
                                    )}

                                    <div className="terms-checkbox">
                                        <input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                                        <label htmlFor="terms" className="terms-text">
                                            Confirmo que he leído y acepto la <a href="#" className="link">Política de Inversión</a> y los <a href="#" className="link">Términos de Servicio</a>.
                                        </label>
                                    </div>

                                    {paymentMethod === 'card' ? (
                                        <button
                                            className="confirm-btn card-btn"
                                            disabled={!amount || !termsAccepted || isCalculating}
                                            onClick={handleStripeCheckout}
                                        >
                                            {isCalculating ? '⏳ Procesando...' : '💳 Procesar Pago Seguro'}
                                        </button>
                                    ) : (
                                        <button className="confirm-btn" disabled={!amount || !termsAccepted || (!cryptoEstimate && paymentMethod === 'crypto')} onClick={handleConfirm}>
                                            {paymentMethod === 'crypto' ? 'Generar Orden de Pago' : '🚀 Confirmar e Invertir'}
                                        </button>
                                    )}

                                    <div className="calculation-results">
                                        <div className="calc-item">
                                            <div className="calc-label">Retorno Esperado</div>
                                            <div className="calc-value green">{calculations.return ? `+$${calculations.return}` : '—'}</div>
                                        </div>
                                        <div className="calc-item">
                                            <div className="calc-label">Fecha de Vencimiento</div>
                                            <div className="calc-value">{calculations.date || '—'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {step === 'payment-console' && transactionData && (
                        <div className="payment-console-container">
                            <div className="console-header">
                                <div className="console-timer">
                                    <span className="timer-icon">⏱</span>
                                    <span>TIEMPO RESTANTE: <span className="timer-val">{formatTime(timeLeft)}</span></span>
                                </div>
                                <div className="console-id">ID de Transacción: <span>{transactionData.id.slice(0, 10)}...</span></div>
                            </div>

                            <div className="console-grid">
                                <div className="console-left">
                                    <div className="qr-highlight">
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${transactionData.payinAddress}`} alt="QR" className="qr-big" />
                                    </div>
                                    <div className="amount-display-large">
                                        <div className="label">ENVÍA EXACTAMENTE</div>
                                        <div className="value">{transactionData.amount} {selectedCoin.toUpperCase()}</div>
                                    </div>
                                    <div className="address-display">
                                        <label>Dirección de Depósito ({selectedCoin.toUpperCase()})</label>
                                        <div className="address-box-large">
                                            <span className="addr-txt">{transactionData.payinAddress}</span>
                                            <button className="copy-btn-large" onClick={() => navigator.clipboard.writeText(transactionData.payinAddress)}>COPIAR</button>
                                        </div>
                                        <div className="warning-text">⚠️ Asegúrese de enviar solo {selectedCoin.toUpperCase()} a esta dirección.</div>
                                    </div>
                                </div>

                                <div className="console-right">
                                    <h3 className="status-title">Estado de la Transacción</h3>
                                    <div className="status-timeline">
                                        {[
                                            { id: 'waiting', label: 'Esperando Depósito', icon: '⏳' },
                                            { id: 'confirming', label: 'Confirmando (Blockchain)', icon: '🔗' },
                                            { id: 'exchanging', label: 'Procesando Pago', icon: '⚙️' },
                                            { id: 'finished', label: 'Completado', icon: '✅' }
                                        ].map((s, idx) => {
                                            const currentStep = getStatusStepObj(txStatus);
                                            // Mapping status strings to indices:
                                            // waiting=0, confirming=1, exchanging=2, sent=2, finished=3
                                            const isActive = idx === currentStep;
                                            const isPast = idx < currentStep;

                                            return (
                                                <div key={s.id} className={`timeline-item ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}>
                                                    <div className="timeline-icon">{s.icon}</div>
                                                    <div className="timeline-content">
                                                        <div className="timeline-label">{s.label}</div>
                                                        {isActive && <div className="timeline-pulse"></div>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="status-info-box">
                                        <p>Detectaremos su pago automáticamente. Por favor no cierre esta ventana.</p>
                                        <p className="sub-info">Estado actual: <span className="status-tag status-console">{txStatus.toUpperCase()}</span></p>
                                    </div>
                                    <button className="cancel-trans-btn" onClick={() => setStep('form')}>Cancelar Transacción</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="success-container-full">
                            <div className="success-card-center">
                                <div className="success-icon-box">🎉</div>
                                <h2 className="success-title">¡Inversión Iniciada Exitosamente!</h2>
                                <p className="success-message">Su pago ha sido confirmado y el <strong>Plan {plan.name}</strong> ha sido activado en su cuenta.</p>

                                <div className="success-details">
                                    <div className="detail-row">
                                        <span>Monto Invertido:</span>
                                        <span>${amount}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Fecha Inicio:</span>
                                        <span>{new Date().toLocaleDateString()}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Retorno Estimado:</span>
                                        <span className="green">+${calculations.return}</span>
                                    </div>
                                </div>

                                <button className="dashboard-btn" onClick={() => navigate('/dashboard/plans')}>
                                    Ir a Mis Planes
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default PlanCheckout;
