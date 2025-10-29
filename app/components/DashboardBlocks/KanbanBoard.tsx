import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, AlertCircle, Calendar, User } from 'lucide-react';
import { Todo } from '../../types/dashboard';

interface KanbanBoardProps {
  todos: Todo[];
  onStatusChange: (taskId: string, newStatus: 'todo' | 'in_progress' | 'done') => Promise<void>;
  onTaskClick: (task: Todo) => void;
  showAssignedMember?: boolean;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  todos,
  onStatusChange,
  onTaskClick,
  showAssignedMember = false,
}) => {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  // Priority order mapping for sorting
  const priorityOrder = { high: 1, moderate: 2, low: 3 };

  // Sort function to order by priority
  const sortByPriority = (a: Todo, b: Todo) => {
    const aPriority = priorityOrder[a.priority] || 3;
    const bPriority = priorityOrder[b.priority] || 3;
    return aPriority - bPriority;
  };

  // Group tasks by kanban_status and sort by priority
  const columns = {
    todo: todos.filter((t) => t.kanban_status === 'todo' || !t.kanban_status).sort(sortByPriority),
    in_progress: todos.filter((t) => t.kanban_status === 'in_progress').sort(sortByPriority),
    done: todos.filter((t) => t.kanban_status === 'done').sort(sortByPriority),
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = async (status: 'todo' | 'in_progress' | 'done') => {
    if (draggedTask) {
      await onStatusChange(draggedTask, status);
      setDraggedTask(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Zap className="w-4 h-4 text-red-400" />;
      case 'moderate':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'low':
        return <Clock className="w-4 h-4 text-green-400" />;
      default:
        return <Clock className="w-4 h-4 text-green-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500/50 bg-red-500/10';
      case 'moderate':
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 'low':
        return 'border-green-500/50 bg-green-500/10';
      default:
        return 'border-green-500/50 bg-green-500/10';
    }
  };

  const formatDeadline = (deadline: string | Date | null | undefined) => {
    if (!deadline) return null;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    const isToday = deadlineDate.getTime() === today.getTime();
    const isPast = deadlineDate < today;

    return {
      date: deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isToday,
      isPast,
    };
  };

  const renderColumn = (
    title: string,
    status: 'todo' | 'in_progress' | 'done',
    tasks: Todo[],
    color: string,
    borderColor: string
  ) => {
    return (
      <div
        className={`bg-slate-900/50 backdrop-blur-sm rounded-lg border-4 ${borderColor} p-4`}
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(status)}
      >
        {/* Column Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-bold font-poppins ${color}`}>
            {title}
          </h2>
          <span className={`${color} bg-slate-800/80 px-3 py-1 rounded-full text-sm font-poppins`}>
            {tasks.length}
          </span>
        </div>

        {/* Tasks */}
        <div className="space-y-3 min-h-[200px]">
          {tasks.length === 0 ? (
            <div className="text-center text-slate-500 py-8 text-sm font-poppins">
              No tasks here
            </div>
          ) : (
            tasks.map((task) => {
              const deadlineInfo = formatDeadline(task.deadline);
              return (
                <motion.div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onTaskClick(task)}
                  className={`
                    cursor-pointer p-4 rounded-lg border-2 transition-all duration-200
                    ${getPriorityColor(task.priority)}
                    ${draggedTask === task.id ? 'opacity-50' : 'opacity-100'}
                    hover:scale-[1.02] hover:shadow-lg
                  `}
                  whileHover={{ y: -2 }}
                  layout
                >
                  {/* Title */}
                  {task.title && (
                    <h3 className="font-bold text-white mb-2 font-poppins text-sm">
                      {task.title}
                    </h3>
                  )}

                  {/* Content */}
                  <p className="text-slate-300 text-sm font-poppins mb-3 line-clamp-3">
                    {task.content}
                  </p>

                  {/* Footer */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {/* Priority Badge */}
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-800/80">
                      {getPriorityIcon(task.priority)}
                      <span className="text-slate-300 font-poppins capitalize">
                        {task.priority}
                      </span>
                    </div>

                    {/* Deadline */}
                    {deadlineInfo && (
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                          deadlineInfo.isPast
                            ? 'bg-red-500/20 text-red-400'
                            : deadlineInfo.isToday
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        <span className="font-poppins">
                          {deadlineInfo.isToday ? 'Today' : deadlineInfo.date}
                        </span>
                      </div>
                    )}

                    {/* Assigned Member */}
                    {showAssignedMember && task.assigned_member && (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-800/80">
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-300 font-poppins">
                          {task.assigned_member}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto pb-4 md:scrollbar-hide">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-4">
        {renderColumn('To Do 📝', 'todo', columns.todo, 'text-slate-300', 'border-slate-600')}
        {renderColumn('In Progress ⏳', 'in_progress', columns.in_progress, 'text-blue-400', 'border-blue-500')}
        {renderColumn('Done 🚀', 'done', columns.done, 'text-green-400', 'border-green-500')}
      </div>
    </div>
  );
};

export default KanbanBoard;
