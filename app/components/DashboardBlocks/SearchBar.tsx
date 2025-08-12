'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search tasks...",
  debounceMs = 300,
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // Call onSearch when debounced term changes
  useEffect(() => {
    onSearch(debouncedTerm);
  }, [debouncedTerm, onSearch]);

  const handleClear = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <div className={`relative w-full max-w-md mx-auto ${className}`}>
      <div className="relative">
        {/* Search Icon */}
        <Search 
          size={20} 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 pointer-events-none" 
        />
        
        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 font-poppins"
        />
        
        {/* Clear Button */}
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200 p-1 hover:bg-white/10 rounded-full"
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      {/* Search indicator */}
      {searchTerm && (
        <div className="absolute -bottom-6 left-0 text-xs text-white/60 font-poppins">
          {debouncedTerm ? `Searching for: "${debouncedTerm}"` : 'Typing...'}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
