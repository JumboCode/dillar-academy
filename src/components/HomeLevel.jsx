// LevelCard.js
import React from 'react';

const LevelCard = ({ imageSource, title, subtitle, topics }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-80 flex flex-col">
      <div className="h-1/3 relative">
        <img src={imageSource} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 p-4 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 mt-2">{subtitle}</p>
        <div className="mt-4 flex flex-wrap gap-x-2 gap-y-2">
          {topics.map((topic, index) => (
            <div
              key={index}
              className= "px-4 py-2 rounded-full text-sm font-medium border border-black whitespace-nowrap"
            >
              {topic}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelCard;