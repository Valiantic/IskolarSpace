import React from 'react';
import { AlertCircle, Clock, Zap, ChevronDown } from 'lucide-react';
import NoTaskBanner from './NoTask';

interface Todo {
  id: string;
  title?: string;
  content: string;
  user_id: string;
  created_at: string;
  priority: 'low' | 'moderate' | 'high';
}

interface TaskGridProps {
  todos: Todo[];
  fetchTodos: () => Promise<void>;
  startEditing: (todo: Todo) => void;
  handlePriorityChange: (todoId: string, newPriority: 'low' | 'moderate' | 'high') => Promise<void>;
  searchTerm?: string;
  priorityFilters?: ('low' | 'moderate' | 'high')[];
  totalTasks?: number;
}

const TaskGrid: React.FC<TaskGridProps> = ({ 
  todos, 
  fetchTodos, 
  startEditing, 
  handlePriorityChange,
  searchTerm = '',
  priorityFilters = [],
  totalTasks = 0
}) => {
  const cardColors = [
    'bg-sky-500',
    'bg-blue-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-sky-500',
    'bg-cyan-500'
  ];

  // Priority configuration
  const getPriorityConfig = (priority: 'low' | 'moderate' | 'high') => {
    switch (priority) {
      case 'high':
        return {
          icon: <Zap size={16} />,
          label: 'High Priority',
          color: 'text-red-300',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-400/50'
        };
      case 'moderate':
        return {
          icon: <AlertCircle size={16} />,
          label: 'Moderate Priority',
          color: 'text-yellow-300',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-400/50'
        };
      case 'low':
        return {
          icon: <Clock size={16} />,
          label: 'Low Priority',
          color: 'text-green-300',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-400/50'
        };
    }
  };

  // Sort todos by priority (high -> moderate -> low)
  const sortedTodos = [...todos].sort((a, b) => {
    const priorityOrder = { high: 3, moderate: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
  return (
    <>
      {todos.length === 0 ? (
        // Show NoTaskBanner when there are no tasks
        <div className="mt-10 animate-fadeIn">
          <NoTaskBanner 
            searchTerm={searchTerm}
            priorityFilters={priorityFilters}
            totalTasks={totalTasks}
          />
        </div>
      ) : (
        // Show tasks grid when there are tasks
        <div className="mt-20 grid p-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mx-auto">
          {sortedTodos.map((todo, index) => {
            const priorityConfig = getPriorityConfig(todo.priority);
            return (        
            <div
              key={todo.id}
              className={`${cardColors[index % cardColors.length]} rounded-lg p-4 sm:p-5 shadow-lg min-h-[120px] w-full flex 
              flex-col justify-between backdrop-blur-sm bg-opacity-80 transform hover:scale-105 transition-transform
               duration-200 cursor-pointer animate-fadeIn relative`}
                onClick={() => startEditing(todo)}
            >
              {/* Priority Badge */}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full ${priorityConfig.bgColor} ${priorityConfig.borderColor} border backdrop-blur-sm`}>
                <div className={`flex items-center gap-1 ${priorityConfig.color}`}>
                  {priorityConfig.icon}
                  <span className="text-xs font-medium font-poppins">{todo.priority.toUpperCase()}</span>
                </div>
              </div>

              <div 
                className="flex-1 pr-16"
              >
                {/* Display title if available, otherwise show truncated content */}
                {todo.title ? (
                  <div>
                    <h3 className="text-white sm:text-lg md:text-2xl font-bold break-words font-poppins mb-1">
                      {todo.title}
                    </h3>
                    <p className="text-white/80 text-sm sm:text-base line-clamp-2 font-poppins">
                      {todo.content.length > 60 ? `${todo.content.substring(0, 60)}...` : todo.content}
                    </p>
                  </div>
                ) : (
                  <p className="text-white sm:text-lg md:text-2xl font-bold break-words font-poppins">
                    {todo.content}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <div className="relative flex items-center">
                  {/* Priority Dropdown with Orb Inside */}
                  <div className="relative flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-md hover:bg-black hover:shadow-md transition-all duration-200">
                    {/* Pulsing Priority Orb */}
                    <div className={`w-3 h-3 rounded-full ${
                      todo.priority === 'low' 
                        ? 'bg-green-400 animate-pulse-green' 
                        : todo.priority === 'moderate'
                        ? 'bg-orange-400 animate-pulse-orange'
                        : 'bg-red-400 animate-pulse-red'
                    }`}></div>
                    
                    <select
                      value={todo.priority}
                      onChange={(e) => {
                        e.stopPropagation();
                        handlePriorityChange(todo.id, e.target.value as 'low' | 'moderate' | 'high');
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="appearance-none p-1 bg-transparent text-white border-0 focus:outline-none transition-all duration-200 cursor-pointer font-poppins text-xs font-medium text-left pr-4"
                    >
                      <option value="low" className="bg-slate-800 text-white">Low</option>
                      <option value="moderate" className="bg-slate-800 text-white">Moderate</option>
                      <option value="high" className="bg-slate-800 text-white">High</option>
                    </select>
                    <ChevronDown 
                      size={12} 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 pointer-events-none" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )})}
        </div>
      )}
    </>  );
};

export default TaskGrid;
