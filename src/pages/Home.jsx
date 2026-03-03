import React from 'react';

const Home = () => {
    return (
        <div className="home-page">
            <Hero />
            <Showcase />
        </div>
    );
}

const Hero = () => {
    return (
        <header className="hero" id="inicio">
            <div className="container hero-content">
                <div className="badge">Bienvenido a nuestra plataforma</div>
                <h1>
                    Transformamos tus ideas <br />
                    <span className="text-gradient">en realidad digital</span>
                </h1>
                <p>
                    Descubre una nueva forma de hacer negocios con nuestras soluciones innovadoras.
                    Impulsa tu crecimiento con tecnología de vanguardia.
                </p>
                <div className="hero-buttons">
                    <button className="btn btn-primary">Empezar ahora →</button>
                    <button className="btn btn-outline">Saber más</button>
                </div>
            </div>
        </header>
    )
}

const Showcase = () => {
    // Icons
    const ChartIcon = () => (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
    )
    const BellIcon = () => (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    )
    const ShieldIcon = () => (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    )
    const AppleIcon = () => (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.68-.83 1.14-1.99.94-3.14-1.07.04-2.43.76-3.22 1.74-.62.77-1.16 1.94-.95 3.1 1.2.09 2.54-.87 3.23-1.7z" />
        </svg>
    )
    const PlayStoreIcon = () => (
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 20.97l11.45-6.3-4.22-4.23L3 3.03v17.94zM15.96 13.1l3.52 1.94c.58.32.57 1.15 0 1.47l-3.52 1.94-2.73-2.73 2.73-2.62zm-.89-3.48l2.73-2.62-3.52-1.94c-.58-.32-1.42-.32-2 0l-3.52 1.94 6.31 2.62zM5.54 11.97l6.3-4.23-7.5-4.14C3.76 3.29 3 3.98 3 4.93v12.14c0 .95.76 1.64 1.34 1.33l1.2-0.67 6.3-4.23-6.3-1.53z" />
        </svg>
    )

    const FeatureItem = ({ icon, title, desc }) => (
        <div className="feature-item">
            <div className="feature-icon">{icon}</div>
            <div className="feature-text">
                <h3>{title}</h3>
                <p>{desc}</p>
            </div>
        </div>
    )

    return (
        <section className="section-padding showcase" id="servicios">
            <div className="container showcase-grid">
                <div className="showcase-content">
                    <div className="badge" style={{ marginBottom: '1rem' }}>Disponible ahora</div>
                    <h2>Lleva Equaly a donde vayas</h2>
                    <p>
                        Descarga nuestra aplicación móvil y mantén el control total de tus inversiones desde cualquier lugar.
                        Opera, monitorea y gestiona tu portafolio con la mejor experiencia móvil del mercado.
                    </p>

                    <div className="feature-list">
                        <FeatureItem
                            icon={<ChartIcon />}
                            title="Trading en tiempo real"
                            desc="Accede a los mercados 24/7 desde tu móvil"
                        />
                        <FeatureItem
                            icon={<BellIcon />}
                            title="Notificaciones inteligentes"
                            desc="Mantente informado de cada movimiento importante"
                        />
                        <FeatureItem
                            icon={<ShieldIcon />}
                            title="Seguridad avanzada"
                            desc="Autenticación biométrica y encriptación total"
                        />
                    </div>

                    <div className="store-buttons">
                        <button className="store-btn">
                            <AppleIcon />
                            <div>
                                <small>Descargar en</small><br />
                                <strong>App Store</strong>
                            </div>
                        </button>
                        <button className="store-btn">
                            <PlayStoreIcon />
                            <div>
                                <small>Disponible en</small><br />
                                <strong>Google Play</strong>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="app-preview">
                    {/* Phone Mockup */}
                    <div className="app-phone">
                        <div className="app-screen">
                            <div className="mock-header">
                                <span>☰</span>
                                <span>EQUALY</span>
                                <span>👤</span>
                            </div>
                            <div className="mock-card">
                                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Balance Total</div>
                                <div className="mock-balance">$24,580.32</div>
                            </div>
                            <div className="mock-card" style={{ background: 'rgba(99, 102, 241, 0.2)' }}>
                                <div style={{ fontSize: '0.8rem' }}>Ganancia 24h</div>
                                <div style={{ color: '#4ade80', fontWeight: 'bold' }}>+12.5%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Home;
