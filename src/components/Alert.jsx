import React, { useState, useEffect } from 'react';

const Alert = ({ message }) => {
    // const [visible, setVisible] = useState(false);
    // useEffect(() => {
    //     if (message) {
    //         setVisible(true);

    //         const timer = setTimeout(() => {
    //             setVisible(false);
    //         }, 3000);

    //         return () => clearTimeout(timer);
    //     }
    // }, [message]);

    // if (!visible) return null;
    return (
        <div className="mb-4 border-l-4 p-4 bg-red-200 text-red-800 rounded-xl border-red-300 fixed top-28 z-30">
            <span> {message} </span>
        </div>
    );
};

export default Alert;