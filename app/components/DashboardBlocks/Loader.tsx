import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      {/* WebM Loader */}
      <div className="relative">
        <video
          src="/videos/rocket.webm"
          autoPlay
          loop
          muted
          playsInline
          className="w-40 h-40 object-contain rounded-full shadow-lg"
        />
      </div>
      {/* Loading text */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-white font-poppins">
          Hang tight! 
        </h3>
        <p className="text-gray-300 text-sm font-poppins">
          Plotting your trajectory through the stars…
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
