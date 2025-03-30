import React from 'react';
import Ink from '../assets/ink_cropped.svg';
import Brush from '../assets/brush_cropped.svg';

const Logo = () => {
    return (
        <div>
            <img
                src={Ink}
                alt='Ink Pot'
                style={{ width: '80px', height: 'auto', margin: '0.5em' }}
            />
            <img
                src={Brush}
                alt='Ink Pot'
                style={{ width: '60px', height: 'auto', margin: '0.5em' }}
            />

        </div>
    );
};

export default Logo;