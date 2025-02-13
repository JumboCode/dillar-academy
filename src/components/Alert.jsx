import React, { useState } from 'react';

const Alert = ({ message, visible }) => {

    if (!visible) {
        return null;
    }
    
    return (
        <div className="mb-4 border-l-4 p-4 bg-red-200 text-red-800 rounded-xl border-red-300">
            <div>
                <span> {message} </span>
            </div>
        </div>
    );
};

export default Alert;