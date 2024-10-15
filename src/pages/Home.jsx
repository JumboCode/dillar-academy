import React from 'react';
import dummyBg from '../assets/dummy-bg.png';

const Home = () => {
    return (
        <div className="min-h-screen">
            <div className="bg-sky-200 p-4">
                <div className="text-center md:text-left mb-12 mt-12 px-5">
                    <h1 className="text-4xl font-bold mb-2">Dillar Academy</h1>
                    <p className="text-lg mb-4">Free English education for Uyghurs around the world.</p>
                    <div className="flex flex-col md:flex-row items-center">
                        <button className="bg-white border-2 border-white text-black font-semibold mb-2 px-2 rounded mr-2 hover:bg-slate-100 hover:border-slate-100" onClick={() => alert('Dummy button-1 clicked!')}>Start Learning</button>
                        <button className="bg-transparent border-2 border-sky-400 text-black font-semibold mb-2 px-2 rounded mr-2 hover:bg-sky-400" onClick={() => alert('Dummy button-2 clicked!')}>Learn More</button>
                    </div>
                </div>
            </div>
            <div className="bg-white p-4 mt-4">
                <h1 className="text-4xl font-bold mb-10 text-center">How It Works</h1>
                <div className="flex flex-col md:flex-row items-center justify-center px-4">
                    <img src={dummyBg} alt="blank-image" className="mb-4 md:mb-0 md:mr-20 rounded-lg shadow-md" />
                    <div className="px-10 text-center md:text-left">
                        <h2 className="text-2xl font-semibold mb-5">Choose your class level</h2>
                        <p className="text-lg mb-4">Take a quick assessment to see what your English level is like</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
