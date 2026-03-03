import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        country: 'Ecuador',
        termsAccepted: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };



    const [status, setStatus] = useState(''); // '', 'sending', 'success', 'error'
    const [serverError, setServerError] = useState('');
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation check before clearing errors
        if (!formData.termsAccepted) {
            setStatus('error');
            setServerError('Debes aceptar los términos y condiciones para continuar.');
            return;
        }

        setStatus('sending');
        setServerError('');

        try {
            // Mapping fields to API requirements
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                country: formData.country,
                acceptedTerms: true // Force true since we validated it above
            };

            const result = await register(payload);

            if (result.success) {
                setStatus('success');
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    country: 'Ecuador'
                });
            } else {
                setStatus('error');
                setServerError(result.error);
            }
        } catch (error) {
            console.error('Error registering:', error);
            setStatus('error');
            setServerError('Error inesperado. Intente más tarde.');
        }
    };

    return (
        <div className="register-page" style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <div className="container">
                <div className="auth-card" style={{ maxWidth: '500px', margin: '0 auto', background: '#0f1029', padding: '40px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div className="text-center" style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2>Crear Cuenta</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Únete a Equaly hoy mismo</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label htmlFor="firstName">Nombres</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    placeholder="Ej. Juan"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Apellidos</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Ej. Perez"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

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

                        <div className="form-group">
                            <label htmlFor="country">País</label>
                            <select
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    background: '#050511',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    padding: '14px 16px',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontFamily: 'inherit',
                                    fontSize: '1rem',
                                    appearance: 'none'
                                }}
                            >
                                <option value="Ecuador">Ecuador</option>
                                <option value="Colombia">Colombia</option>
                                <option value="Peru">Perú</option>
                                <option value="Mexico">México</option>
                                <option value="Argentina">Argentina</option>
                                <option value="Chile">Chile</option>
                                <option value="Other">Otro</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                id="termsAccepted"
                                name="termsAccepted"
                                checked={formData.termsAccepted}
                                onChange={handleChange}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="termsAccepted" style={{ margin: 0, fontSize: '0.9rem', cursor: 'pointer', color: 'rgba(255, 255, 255, 0.8)' }}>
                                Acepto los <a href="#" style={{ color: '#3b82f6', textDecoration: 'none' }}>Términos y Condiciones</a>
                            </label>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '20px' }} disabled={status === 'sending'}>
                            {status === 'sending' ? 'Registrando...' : 'Registrarse'}
                        </button>

                        {status === 'success' && (
                            <div className="form-alert success" style={{ marginTop: '20px', padding: '12px', borderRadius: '8px', background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', textAlign: 'center', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                                Cuenta creada exitosamente. ¡Bienvenido!
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="form-alert error" style={{ marginTop: '20px', padding: '12px', borderRadius: '8px', background: 'rgba(248, 113, 113, 0.1)', color: '#f87171', textAlign: 'center', border: '1px solid rgba(248, 113, 113, 0.2)' }}>
                                {serverError}
                            </div>
                        )}

                        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            ¿Ya tienes una cuenta? <Link to="/login" style={{ color: 'var(--primary)' }}>Inicia Sesión</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
