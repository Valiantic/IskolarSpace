import React from 'react'
import Image from 'next/image'
import NoTaskImage from '../../../public/images/NoTask.png'
import { Search, Filter, AlertCircle, Clock, Zap } from 'lucide-react'
import { NoTaskBannerProps } from '../../types/dashboard'

const NoTaskBanner: React.FC<NoTaskBannerProps> = ({ 
  searchTerm = '', 
  priorityFilters = [], 
  totalTasks = 0 
}) => {
  // Determine the type of empty state
  const hasActiveFilters = searchTerm.trim() || priorityFilters.length > 0;
  const isSearch = searchTerm.trim();
  const isPriorityFilter = priorityFilters.length > 0;
  
  // Get priority icons and colors
  const getPriorityDisplay = (priority: 'low' | 'moderate' | 'high') => {
    switch (priority) {
      case 'high':
        return { icon: <Zap size={16} />, color: 'text-red-400', label: 'High Priority' };
      case 'moderate':
        return { icon: <AlertCircle size={16} />, color: 'text-yellow-400', label: 'Moderate Priority' };
      case 'low':
        return { icon: <Clock size={16} />, color: 'text-green-400', label: 'Low Priority' };
    }
  };

  const getTitle = () => {
    if (hasActiveFilters) {
      if (isSearch && isPriorityFilter) {
        return "No tasks match your search and priority filters";
      } else if (isSearch) {
        return `No tasks found for "${searchTerm}"`;
      } else if (isPriorityFilter && priorityFilters.length === 1) {
        const priority = priorityFilters[0];
        const display = getPriorityDisplay(priority);
        return (
          <span className="flex items-center justify-center gap-2">
            <span className={display.color}>{display.icon}</span>
            No {display.label.toLowerCase()} tasks found
          </span>
        );
      } else {
        return "No tasks match your priority filters";
      }
    }
    return "Oops! it looks like there are no task in your space";
  };

  const getDescription = () => {
    if (hasActiveFilters) {
      if (totalTasks > 0) {
        return "Try adjusting your search terms or priority filters to find what you're looking for.";
      } else {
        return "You don't have any tasks yet. Create your first task to get started!";
      }
    }
    return "Begin your productivity journey by clicking the + button on the right side below";
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      <div className="bg-transparent bg-opacity-60 p-8 rounded-2xl shadow-2xl border border-blue-400 backdrop-blur-sm max-w-2xl w-full animate-scaleIn">
        <div className="flex flex-col items-center">
          <div className="animate-floating">
            {hasActiveFilters ? (
              <div className="flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
                <div className="bg-blue-500/20 rounded-full p-8 backdrop-blur-sm border border-blue-400/30">
                  {isSearch ? (
                    <Search size={80} className="text-blue-300 mx-auto" />
                  ) : (
                    <Filter size={80} className="text-blue-300 mx-auto" />
                  )}
                </div>
              </div>
            ) : (
              <Image
                src={NoTaskImage}
                alt="No Tasks" 
                className="mx-auto w-64 h-auto md:w-80 drop-shadow-lg"
                priority
              />
            )}
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mt-6 text-center bg-gradient-to-r from-sky-300 via-blue-400 to-cyan-300 text-transparent bg-clip-text">
            {getTitle()}
          </h2>
          
          {/* Active filters display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {searchTerm.trim() && (
                <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/50 rounded-full text-blue-300 text-sm font-poppins flex items-center gap-1">
                  <Search size={14} />
                  "{searchTerm}"
                </span>
              )}
              {priorityFilters.map(priority => {
                const display = getPriorityDisplay(priority);
                return (
                  <span 
                    key={priority}
                    className={`px-3 py-1 rounded-full text-sm font-poppins border flex items-center gap-1 ${
                      priority === 'high' 
                        ? 'bg-red-500/20 border-red-400/50 text-red-300'
                        : priority === 'moderate'
                        ? 'bg-yellow-500/20 border-yellow-400/50 text-yellow-300'
                        : 'bg-green-500/20 border-green-400/50 text-green-300'
                    }`}
                  >
                    {display.icon}
                    {display.label}
                  </span>
                );
              })}
            </div>
          )}
          
          <div className="mt-4 bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-500 border-opacity-30">
            <p className="text-blue-100 text-center text-lg">
              {getDescription()}
              {!hasActiveFilters && (
                <span className="inline-flex items-center bg-blue-500 text-white rounded-full px-2 py-1 text-sm mx-1"> + </span>
              )}
            </p>
          </div>
          
          <div className="mt-6 flex gap-3">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i}
                className="h-1 w-1 rounded-full bg-blue-400 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoTaskBanner
