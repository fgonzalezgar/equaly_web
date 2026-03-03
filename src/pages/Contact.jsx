import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const payload = {
                nombre: formData.name,
                email: formData.email,
                mensaje: formData.message
            };

            const response = await fetch('https://apiq.cinndev.co/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setStatus(''), 5000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        }
    };

    return (
        <div className="contact-page">
            <header className="contact-hero">
                <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <h1>Contáctanos</h1>
                    <p>Estamos aquí para ayudarte</p>
                </div>
            </header>

            <div className="container contact-section">
                <div className="contact-grid">
                    {/* Left Column: Info */}
                    <div className="contact-info">
                        <h2>Ponte en contacto</h2>
                        <p className="contact-desc">
                            ¿Tienes preguntas sobre nuestros servicios?
                            Nuestro equipo está listo para responder todas tus dudas.
                        </p>

                        <div className="info-item">
                            <div className="info-icon">
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="info-text">
                                <small>Email</small>
                                <strong>soporte@equaly.com</strong>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="contact-form-wrapper">
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Nombre Completo</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Tu nombre"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
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
                                <label htmlFor="message">Mensaje</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    placeholder="¿Cómo podemos ayudarte?"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary btn-block" disabled={status === 'sending'}>
                                {status === 'sending' ? 'Enviando...' : 'Enviar Mensaje'}
                            </button>

                            {status === 'success' && (
                                <div className="form-alert success">
                                    Mensaje enviado correctamente. Te contactaremos pronto.
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="form-alert error" style={{ color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.2)', backgroundColor: 'rgba(248, 113, 113, 0.1)' }}>
                                    Hubo un error al enviar tu mensaje. Por favor intenta nuevamente.
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
