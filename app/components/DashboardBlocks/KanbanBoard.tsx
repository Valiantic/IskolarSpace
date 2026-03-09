import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, AlertCircle, Calendar, User, Trash2, CheckCircle2, Circle, ListTodo, Activity, Rocket } from 'lucide-react';
import { Todo } from '../../types/dashboard';

interface KanbanBoardProps {
  todos: Todo[];
  onStatusChange: (taskId: string, newStatus: 'todo' | 'in_progress' | 'done') => Promise<void>;
  onTaskClick: (task: Todo) => void;
  onBulkDelete?: (taskIds: string[]) => void;
  showAssignedMember?: boolean;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  todos,
  onStatusChange,
  onTaskClick,
  onBulkDelete,
  showAssignedMember = false,
}) => {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

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

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.setData('taskId', taskId);
    // Add a ghost image or effect
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.4';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedTask(null);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleDrop = async (status: 'todo' | 'in_progress' | 'done') => {
    if (draggedTask) {
      await onStatusChange(draggedTask, status);
      setDraggedTask(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const toggleSelection = (taskId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedIds(newSelected);
    if (newSelected.size > 0) {
      setIsSelectionMode(true);
    } else {
      setIsSelectionMode(false);
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  const handleDeleteSelected = () => {
    if (onBulkDelete && selectedIds.size > 0) {
      onBulkDelete(Array.from(selectedIds));
      clearSelection();
    }
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

  const getPriorityColor = (priority: string, isSelected: boolean) => {
    if (isSelected) return 'border-sky-500 bg-sky-500/20 ring-2 ring-sky-500/50';
    switch (priority) {
      case 'high':
        return 'border-red-500/50 bg-red-500/10 hover:border-red-400';
      case 'moderate':
        return 'border-yellow-500/50 bg-yellow-500/10 hover:border-yellow-400';
      case 'low':
        return 'border-green-500/50 bg-green-500/10 hover:border-green-400';
      default:
        return 'border-green-500/50 bg-green-500/10 hover:border-green-400';
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
    borderColor: string,
    Icon: React.ElementType
  ) => {
    return (
      <motion.div
        layout
        className={`bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/10 p-5 flex flex-col h-full min-h-[500px] transition-all duration-300 shadow-inner shadow-white/5`}
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(status)}
      >
        {/* Column Header */}
        <div className="flex items-center justify-between mb-6 group">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-slate-800/80 border border-white/5 shadow-lg`}>
              <Icon size={18} className={color} />
            </div>
            <h2 className={`text-lg font-black font-poppins tracking-wider uppercase text-white`}>
              {title}
            </h2>
          </div>
          <span className={`${color} bg-white/5 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-black font-poppins border border-white/10`}>
            {tasks.length}
          </span>
        </div>

        {/* Tasks */}
        <div className="space-y-4 flex-1">
          <AnimatePresence mode="popLayout">
            {tasks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl"
              >
                <div className="p-3 bg-slate-800/30 rounded-full mb-2">
                  <CheckCircle2 className="w-6 h-6 opacity-20" />
                </div>
                <p className="text-xs font-poppins uppercase tracking-widest opacity-50 font-bold text-center">Empty Zone</p>
              </motion.div>
            ) : (
              tasks.map((task) => {
                const deadlineInfo = formatDeadline(task.deadline);
                const isSelected = selectedIds.has(task.id);
                return (
                  <motion.div
                    key={task.id}
                    layoutId={task.id}
                    draggable
                    onDragStart={(e: any) => handleDragStart(e, task.id)}
                    onDragEnd={(e: any) => handleDragEnd(e)}
                    onClick={() => isSelectionMode ? toggleSelection(task.id) : onTaskClick(task)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative group cursor-pointer p-5 rounded-xl border-2 transition-all duration-300
                      ${getPriorityColor(task.priority, isSelected)}
                      ${draggedTask === task.id ? 'opacity-30' : 'opacity-100'}
                      shadow-lg shadow-black/20
                    `}
                  >
                    {/* Selection Indicator */}
                    <button
                      onClick={(e) => toggleSelection(task.id, e)}
                      className={`
                        absolute top-3 right-3 p-1 rounded-full transition-all duration-300 z-10
                        ${isSelected ? 'bg-sky-500 text-white opacity-100' : 'bg-slate-800/50 text-slate-500 opacity-0 group-hover:opacity-100'}
                      `}
                    >
                      {isSelected ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    </button>

                    {/* Title */}
                    {task.title && (
                      <h3 className="font-black text-white mb-2 font-poppins text-sm leading-tight group-hover:text-sky-300 transition-colors">
                        {task.title}
                      </h3>
                    )}

                    {/* Content */}
                    <p className="text-slate-400 text-xs font-poppins mb-4 line-clamp-2 leading-relaxed italic">
                      "{task.content}"
                    </p>

                    {/* Footer */}
                    <div className="flex flex-wrap items-center gap-2 mt-auto">
                      {/* Priority Badge */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/5">
                        {getPriorityIcon(task.priority)}
                        <span className="text-[10px] text-slate-300 font-bold font-poppins uppercase tracking-wider">
                          {task.priority}
                        </span>
                      </div>

                      {/* Deadline */}
                      {deadlineInfo && (
                        <div
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                            deadlineInfo.isPast
                              ? 'bg-red-500/10 border-red-500/20 text-red-400'
                              : deadlineInfo.isToday
                              ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                              : 'bg-black/40 border-white/5 text-slate-300'
                          }`}
                        >
                          <Calendar className="w-3 h-3" />
                          <span className="text-[10px] font-bold font-poppins uppercase tracking-wider">
                            {deadlineInfo.isToday ? 'Today' : deadlineInfo.date}
                          </span>
                        </div>
                      )}

                      {/* Assigned Member */}
                      {showAssignedMember && task.assigned_member && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/5 ml-auto">
                          <User className="w-3 h-3 text-sky-400" />
                          <span className="text-[10px] text-slate-400 font-bold font-poppins uppercase tracking-wider truncate max-w-[80px]">
                            {task.assigned_member}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Selection Overlay for Selection Mode */}
                    {isSelectionMode && !isSelected && (
                      <div className="absolute inset-0 bg-black/10 rounded-xl z-0 pointer-events-none" />
                    )}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Selection Control Bar */}
      <AnimatePresence>
        {isSelectionMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-between bg-sky-500/10 backdrop-blur-xl border border-sky-500/30 p-4 rounded-2xl shadow-2xl shadow-sky-500/10"
          >
            <div className="flex items-center gap-4">
              <div className="bg-sky-500 text-white px-3 py-1 rounded-lg font-black font-poppins text-xs transform -rotate-2">
                {selectedIds.size} SELECTED
              </div>
              <button 
                onClick={clearSelection}
                className="text-slate-400 hover:text-white text-xs font-bold font-poppins uppercase tracking-widest transition-colors"
              >
                Clear All
              </button>
            </div>
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-bold font-poppins text-sm transition-all shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95"
            >
              <Trash2 size={16} />
              DELETE SELECTED
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[900px]">
          {renderColumn('To Do', 'todo', columns.todo, 'text-slate-400', 'border-slate-800/50', ListTodo)}
          {renderColumn('In Progress', 'in_progress', columns.in_progress, 'text-sky-400', 'border-sky-500/20', Activity)}
          {renderColumn('Done', 'done', columns.done, 'text-emerald-400', 'border-emerald-500/20', Rocket)}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;

