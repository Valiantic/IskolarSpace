'use client'

import React, { useState, useCallback } from 'react';
import { Filter, Check, AlertCircle, Clock, Zap } from 'lucide-react';

interface PriorityFilterProps {
  onFilterChange: (priorities: ('low' | 'moderate' | 'high')[]) => void;
  className?: string;
}

const PriorityFilter: React.FC<PriorityFilterProps> = ({
  onFilterChange,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPriorities, setSelectedPriorities] = useState<('low' | 'moderate' | 'high')[]>([]);

  const priorities = [
    { 
      value: 'high', 
      label: 'High Priority', 
      color: 'text-red-400', 
      bgColor: 'bg-red-500/20', 
      hoverColor: 'hover:bg-red-500/30',
      icon: <Zap size={16} />
    },
    { 
      value: 'moderate', 
      label: 'Moderate Priority', 
      color: 'text-yellow-400', 
      bgColor: 'bg-yellow-500/20', 
      hoverColor: 'hover:bg-yellow-500/30',
      icon: <AlertCircle size={16} />
    },
    { 
      value: 'low', 
      label: 'Low Priority', 
      color: 'text-green-400', 
      bgColor: 'bg-green-500/20', 
      hoverColor: 'hover:bg-green-500/30',
      icon: <Clock size={16} />
    }
  ];

  const togglePriority = useCallback((priority: 'low' | 'moderate' | 'high') => {
    const newSelected = selectedPriorities.includes(priority)
      ? selectedPriorities.filter(p => p !== priority)
      : [...selectedPriorities, priority];
    
    setSelectedPriorities(newSelected);
    onFilterChange(newSelected);
  }, [selectedPriorities, onFilterChange]);

  const clearFilters = useCallback(() => {
    setSelectedPriorities([]);
    onFilterChange([]);
  }, [onFilterChange]);

  const toggleDropdown = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <div className={`relative ${className}`}>
      {/* Filter Button */}
      <button
        onClick={toggleDropdown}
        className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-200 font-poppins ${
          selectedPriorities.length > 0 ? 'ring-2 ring-blue-400/50' : ''
        }`}
      >
        <Filter size={20} />
        <span className="text-sm font-medium">
          {selectedPriorities.length === 0 
            ? 'Filter Priority' 
            : `${selectedPriorities.length} Selected`
          }
        </span>
        {selectedPriorities.length > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-blue-500 text-xs rounded-full">
            {selectedPriorities.length}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 lg:left-0 lg:transform-none mt-2 w-64 bg-slate-800/95 backdrop-blur-md border border-white/20 rounded-xl shadow-xl z-50 animate-scaleIn">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold font-poppins text-sm">Filter by Priority</h3>
              {selectedPriorities.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-blue-400 hover:text-blue-300 text-xs font-poppins transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Priority Options */}
            <div className="space-y-2">
              {priorities.map((priority) => (
                <button
                  key={priority.value}
                  onClick={() => togglePriority(priority.value as 'low' | 'moderate' | 'high')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    selectedPriorities.includes(priority.value as 'low' | 'moderate' | 'high')
                      ? `${priority.bgColor} border border-white/20`
                      : 'hover:bg-white/10'
                  } ${priority.hoverColor}`}
                >
                  <div className={`flex-shrink-0 ${priority.color}`}>
                    {priority.icon}
                  </div>
                  <span className={`flex-1 text-left font-poppins text-sm ${priority.color}`}>
                    {priority.label}
                  </span>
                  {selectedPriorities.includes(priority.value as 'low' | 'moderate' | 'high') && (
                    <Check size={16} className="text-white" />
                  )}
                </button>
              ))}
            </div>

            {/* Selected Count */}
            {selectedPriorities.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-white/70 text-xs font-poppins text-center">
                  {selectedPriorities.length} priority level{selectedPriorities.length === 1 ? '' : 's'} selected
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default PriorityFilter;
