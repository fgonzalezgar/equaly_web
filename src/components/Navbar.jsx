import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="logo">
                    <img src="/images/mascot.png" alt="Equaly Logo" />
                    <span>EQUALY</span>
                </Link>
                <div className="nav-links">
                    <Link to="/">Inicio</Link>
                    <a href="/#servicios">Servicios</a>
                    <a href="/#nosotros">Nosotros</a>
                    <Link to="/activos">Activos</Link>
                    <Link to="/contacto">Contacto</Link>
                </div>
                <div className="nav-buttons" style={{ display: 'flex', gap: '15px' }}>
                    <Link to="/registro" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center' }}>Crear Cuenta</Link>
                    <button className="btn btn-primary">Comprar Monedas</button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
