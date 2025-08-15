// components/CreateSpaceModal.tsx
import React, { useState, useEffect } from 'react';
import { CreateSpaceModalProps } from '../../types/join-space';
import IskolarSpaceLogo from '../../../public/images/iskolarspace_logo.png';
import Image from 'next/image';

const CreateSpaceModal: React.FC<CreateSpaceModalProps> = ({
  isOpen,
  onClose,
  onCreateSpace,
  spaceName,
  spaceCode,
  isGenerating,
  onSpaceNameChange,
  onSpaceCodeChange,
  onGenerateCode
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleCreateSpace = () => {
    if (spaceName.trim() && spaceCode.trim()) {
      onCreateSpace({ name: spaceName, code: spaceCode });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-gradient-to-b from-indigo-900 via-blue-900 to-indigo-950 rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        
        {/* Stars background for modal */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-40 animate-pulse"
              style={{
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 2 + 's',
                animationDuration: (Math.random() * 3 + 2) + 's'
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gray-800 rounded-full flex items-center justify-center border-4 border-gray-700 shadow-xl">
                <Image
                  src={IskolarSpaceLogo}
                  alt="IskolarSpace Logo"
                  layout="fill"
                  objectFit="contain"
                />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
            Create a Space
          </h2>
          
          {/* Subtitle */}
          <p className="text-gray-300 text-center mb-8 text-sm sm:text-base">
            Set up your collaborative workspace
          </p>

          {/* Form */}
          <div className="space-y-6">
            {/* Space Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Space Name
              </label>
              <input
                type="text"
                value={spaceName}
                onChange={(e) => onSpaceNameChange(e.target.value)}
                placeholder="Enter space name..."
                className="w-full px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            {/* Space Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Space Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={spaceCode}
                  onChange={(e) => onSpaceCodeChange(e.target.value.toUpperCase())}
                  placeholder="Space code..."
                  maxLength={6}
                  className="flex-1 px-4 py-3 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base font-mono tracking-wider"
                />
                <button
                  onClick={onGenerateCode}
                  disabled={isGenerating}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 text-sm whitespace-nowrap"
                >
                  {isGenerating ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Generate Code'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateSpace}
              disabled={!spaceName.trim() || !spaceCode.trim()}
              className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
              Create Space
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSpaceModal;