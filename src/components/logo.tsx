import React from 'react';
import pizzaLogo from '../assets/Home/pizza.png';
import './logo.css';

interface LogoProps {
    alt?: string;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ alt = 'Pizza Logo', className = '' }) => {
    return <img src={pizzaLogo} alt={alt} className={`img-fluid logo-shadow ${className}`} />;
};

export default Logo;
