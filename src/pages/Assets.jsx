import React from 'react';

const Assets = () => {
    return (
        <div className="assets-page" style={{ paddingTop: '100px', paddingBottom: '80px', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '80px' }}>

            {/* Section: Herramientas */}
            <section className="container" style={{ width: '100%' }}>
                <div className="text-center" style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <span className="badge" style={{ marginBottom: '15px' }}>Tecnología Avanzada</span>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Herramientas de Análisis y Negociación</h2>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                        Potencia tus decisiones con inteligencia artificial y análisis técnico de vanguardia
                    </p>
                </div>

                <div className="tools-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    <ToolCard
                        icon="💡"
                        color="#10b981"
                        title="Autochartist"
                        desc="Análisis técnico inteligente con IA que escanea tendencias y datos históricos para identificar oportunidades de mercado."
                    />
                    <ToolCard
                        icon="📉"
                        color="#a855f7"
                        title="Gráficos Inteligentes"
                        desc="Seguimiento de datos vitales de acciones y divisas con visualizaciones interactivas para decisiones informadas."
                    />
                    <ToolCard
                        icon="🛡️"
                        color="#3b82f6"
                        title="Gestión de Riesgos"
                        desc="Stop Loss y Take Profit preconfigurables para cerrar posiciones automáticamente y proteger tu capital."
                    />
                    <ToolCard
                        icon="⚡"
                        color="#f97316"
                        title="Apalancamiento"
                        desc="Multiplica tu capacidad de inversión en posiciones iniciales con opciones flexibles de apalancamiento."
                    />
                    <ToolCard
                        icon="📅"
                        color="#10b981"
                        bgClass="dark-green"
                        title="Calendario Económico"
                        desc="Eventos económicos globales integrados que pueden afectar las tendencias del mercado en tiempo real."
                    />
                    <ToolCard
                        icon="🔔"
                        color="#be185d"
                        title="Alertas Personalizadas"
                        desc="Notificaciones push y por correo sobre cambios de precio en activos de interés vía app Xcite."
                    />
                </div>
            </section>

            {/* Section: Activos Disponibles */}
            <section className="container" style={{ width: '100%' }}>
                <div className="text-center" style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>Activos Disponibles</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Opera con más de 150 CFDs en los mercados más importantes del mundo</p>
                </div>

                {/* Asset Categories Grid */}
                <div className="assets-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    <AssetCard icon="💱" title="Forex" subtitle="50+ pares" color="#10b981" />
                    <AssetCard icon="📈" title="Acciones" subtitle="Amazon, Netflix..." color="#3b82f6" />
                    <AssetCard icon="₿" title="Cripto" subtitle="BTC, ETH, más" color="#f59e0b" />
                    <AssetCard icon="📊" title="Índices" subtitle="S&P 500, DAX..." color="#a855f7" />
                    <AssetCard icon="🥇" title="Materias" subtitle="Oro, Petróleo..." color="#eab308" />
                    <AssetCard icon="🏛️" title="ETFs" subtitle="Fondos cotizados" color="#ec4899" />
                </div>

                {/* Popular Tickers */}
                <div className="tickers-bar" style={{ background: '#0f1029', padding: '15px 25px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '20px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>Populares:</span>
                    <TickerItem symbol="EUR/USD" change="+0.12%" isUp={true} />
                    <TickerItem symbol="BTC/USD" change="+4.28%" isUp={true} />
                    <TickerItem symbol="AMZN" change="-0.85%" isUp={false} />
                    <TickerItem symbol="XAU/USD" change="+1.32%" isUp={true} />
                    <TickerItem symbol="S&P 500" change="+0.67%" isUp={true} />
                    <TickerItem symbol="NFLX" change="+2.14%" isUp={true} />
                </div>
            </section>

        </div>
    );
};

// Sub-components
const AssetCard = ({ icon, title, subtitle, color }) => (
    <div className="asset-card" style={{
        background: '#0f1029',
        padding: '25px',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.05)',
        textAlign: 'center',
        transition: 'transform 0.3s ease',
        cursor: 'pointer'
    }}>
        <div style={{
            width: '60px',
            height: '60px',
            background: color,
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            margin: '0 auto 15px',
            color: 'white',
            boxShadow: `0 10px 20px -5px ${color}66`
        }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>{title}</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{subtitle}</p>
    </div>
);

const TickerItem = ({ symbol, change, isUp }) => (
    <div style={{
        background: 'rgba(255,255,255,0.03)',
        padding: '6px 12px',
        borderRadius: '6px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        fontSize: '0.9rem'
    }}>
        <span style={{ fontWeight: '600' }}>{symbol}</span>
        <span style={{ color: isUp ? '#10b981' : '#f43f5e', fontWeight: 'bold' }}>{change}</span>
    </div>
);

const ToolCard = ({ icon, title, desc, color }) => (
    <div className="tool-card" style={{
        background: '#0f1029',
        padding: '30px',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
    }}>
        <div style={{
            width: '50px',
            height: '50px',
            background: color,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            marginBottom: '20px',
            color: 'white'
        }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>{desc}</p>
    </div>
);

export default Assets;
