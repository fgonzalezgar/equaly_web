import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(''); // 'sending', 'success', 'error'

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');

        // Simulate API call
        setTimeout(() => {
            console.log('Recovery email sent to:', email);
            setStatus('success');
        }, 1500);
    };

    return (
        <div className="forgot-password-page" style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <div className="container">
                <div className="auth-card" style={{ maxWidth: '450px', margin: '0 auto', background: '#0f1029', padding: '40px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div className="text-center" style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2>Recuperar Contraseña</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Ingresa tu correo para recibir instrucciones</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={status === 'sending' || status === 'success'}>
                            {status === 'sending' ? 'Enviando...' : 'Enviar enlace de recuperación'}
                        </button>

                        {status === 'success' && (
                            <div className="form-alert success" style={{ marginTop: '20px', padding: '12px', borderRadius: '8px', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', textAlign: 'center', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                                Hemos enviado un enlace a tu correo. Revisa tu bandeja de entrada.
                            </div>
                        )}

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Link to="/login" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                ← Volver a Iniciar Sesión
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
