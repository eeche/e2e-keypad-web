import React from 'react';
import '../style/keypad.css';

export default function SecureKeypad({ keypad, onKeyPressed }) {
    if (!keypad || !keypad.keypadImage || !keypad.hashList) {
        return <div>Loading keypad...</div>;
    }

    return (
        <div className="keypad-container">
            <img 
                src={`data:image/png;base64,${keypad.keypadImage}`} 
                alt="Secure Keypad" 
                className="keypad-image"
            />
            <div className="keypad-overlay">
                {keypad.hashList.map((hash, index) => (
                    <button 
                        key={index} 
                        className="keypad-button"
                        onClick={() => onKeyPressed(hash)}
                    >
                        <div className="button-overlay"></div>
                    </button>
                ))}
            </div>
        </div>
    );
}