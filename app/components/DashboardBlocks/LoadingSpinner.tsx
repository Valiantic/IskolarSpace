import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      {/* Animated Spinner */}
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-blue-200 border-solid rounded-full animate-spin border-t-transparent"></div>
      </div>
      
      {/* Loading text */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-white font-poppins">
          Loading your workspace...
        </h3>
        <p className="text-gray-300 text-sm font-poppins">
          Preparing your tasks and data
        </p>
      </div>
      
      {/* Animated dots */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
