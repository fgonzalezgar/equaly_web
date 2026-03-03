import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const [status, setStatus] = useState(''); // '', 'sending', 'success', 'error'
    const [serverError, setServerError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        setServerError('');

        try {
            const result = await login(formData);

            if (result.success) {
                setStatus('success');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            } else {
                setStatus('error');
                setServerError(result.error);
            }
        } catch (error) {
            console.error('Login error:', error);
            setStatus('error');
            setServerError('Error inesperado. Intente más tarde.');
        }
    };

    return (
        <div className="login-page" style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <div className="container">
                <div className="auth-card" style={{ maxWidth: '450px', margin: '0 auto', background: '#0f1029', padding: '40px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div className="text-center" style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2>Iniciar Sesión</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Bienvenido de nuevo a Equaly</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                            <Link to="/recuperar-password" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>¿Olvidaste tu contraseña?</Link>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={status === 'sending'}>
                            {status === 'sending' ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>

                        {status === 'success' && (
                            <div className="form-alert success" style={{ marginTop: '20px', padding: '12px', borderRadius: '8px', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', textAlign: 'center', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                                ¡Bienvenido a Equaly!
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="form-alert error" style={{ marginTop: '20px', padding: '12px', borderRadius: '8px', background: 'rgba(248, 113, 113, 0.1)', color: '#f87171', textAlign: 'center', border: '1px solid rgba(248, 113, 113, 0.2)' }}>
                                {serverError}
                            </div>
                        )}

                        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            ¿No tienes una cuenta? <Link to="/registro" style={{ color: 'var(--primary)' }}>Regístrate</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
