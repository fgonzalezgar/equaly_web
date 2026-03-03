import React from 'react';

const Footer = () => {
    const SocialIcon = ({ color }) => (
        <div style={{ width: 32, height: 32, background: color, borderRadius: '50%' }}></div>
    )

    return (
        <footer className="footer" id="contacto-footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="logo">
                            <img src="/images/mascot.png" alt="Equaly Logo" />
                            <span>EQUALY</span>
                        </div>
                        <p>
                            La plataforma líder en inversiones de criptomonedas y activos digitales.
                        </p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <SocialIcon color="#4267B2" />
                            <SocialIcon color="#C13584" />
                            <SocialIcon color="#1DA1F2" />
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Producto</h4>
                        <ul>
                            <li><a href="#">Planes</a></li>
                            <li><a href="#">Comprar Monedas</a></li>
                            <li><a href="#">Contacto</a></li>
                            <li><a href="#">Activos</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Compañía</h4>
                        <ul>
                            <li><a href="#">Nosotros</a></li>
                            <li><a href="#">Contacto</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Contacto</h4>
                        <ul>
                            <li><a href="mailto:soporte@equaly.com">soporte@equaly.com</a></li>
                            <li><a href="tel:+15551234567">+1 (555) 123-4567</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 Equaly. Todos los derechos reservados.</p>
                    <div style={{ marginTop: '10px' }}>
                        <a href="#" style={{ margin: '0 10px' }}>Términos de Servicio</a>
                        <a href="#" style={{ margin: '0 10px' }}>Política de Privacidad</a>
                        <a href="#" style={{ margin: '0 10px' }}>Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
