import React from 'react';
import logo from '../assets/logo.svg';

const Logo = () => {
    return (
        <img
            src={logo}
            alt='Logo'
            style={{ width: '300px', height: 'auto', margin: '0.5em', top: 0, left: 0, position: 'absolute' }}
        />
    );
};

export default Logo;