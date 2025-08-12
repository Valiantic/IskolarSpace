'use client'

import React from 'react';
import { Rocket } from 'lucide-react';

interface AddTaskModalProps {
  showInput: boolean;
  title: string;
  task: string;
  priority: 'low' | 'moderate' | 'high';
  setTitle: (title: string) => void;
  setTask: (task: string) => void;
  setPriority: (priority: 'low' | 'moderate' | 'high') => void;
  handleAddTask: (e: React.FormEvent<HTMLFormElement>) => void;
  setShowInput: (show: boolean) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  showInput,
  title,
  task,
  priority,
  setTitle,
  setTask,
  setPriority,
  handleAddTask,
  setShowInput,
}) => {
  if (!showInput) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-hidden">
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-6 rounded-lg shadow-xl w-full max-w-md border border-blue-500 m-4 overflow-hidden">
        <h2 className="text-xl text-center font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-cyan-300 font-poppins">
          What's your plan for today?
        </h2>
        <form onSubmit={handleAddTask}>
          {/* Title Input (Optional) */}
          <input
            type="text"
            className="w-full text-center border-2 border-blue-400 p-4 rounded-lg mb-3 text-white bg-slate-800 focus:border-cyan-400 focus:outline-none font-poppins"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title (optional)"
          />
          
          <textarea
            className="w-full border-2 border-blue-400 p-4 rounded-lg mb-4 resize-none h-32 text-white bg-slate-800 focus:border-cyan-400 focus:outline-none font-poppins no-scrollbar"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter your task description here..."
            autoFocus
          />
          
          {/* Priority Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2 font-poppins">Priority Level</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('low')}
                className={`p-2 rounded-lg border transition-all font-poppins ${
                  priority === 'low'
                    ? 'bg-green-500/30 border-green-400 text-green-300'
                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-green-400'
                }`}
              >
                Low
              </button>
              <button
                type="button"
                onClick={() => setPriority('moderate')}
                className={`p-2 rounded-lg border transition-all font-poppins ${
                  priority === 'moderate'
                    ? 'bg-yellow-500/30 border-yellow-400 text-yellow-300'
                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-yellow-400'
                }`}
              >
                Moderate
              </button>
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`p-2 rounded-lg border transition-all font-poppins ${
                  priority === 'high'
                    ? 'bg-red-500/30 border-red-400 text-red-300'
                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-red-400'
                }`}
              >
                High
              </button>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowInput(false)}
              className="px-4 py-2 bg-slate-700 text-gray-200 rounded-lg hover:bg-slate-600 transition-colors font-poppins"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex justify-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 text-white rounded-lg hover:from-sky-600 hover:via-blue-600 hover:to-cyan-600 transition-colors font-poppins"
            >
              Add Task <Rocket size={20}/>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
