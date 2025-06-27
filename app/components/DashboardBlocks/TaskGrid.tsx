import React from 'react';
import { Trash } from 'lucide-react';
import NoTaskBanner from './NoTask';

interface Todo {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

interface TaskGridProps {
  todos: Todo[];
  fetchTodos: () => Promise<void>;
  setShowDeleteModal: (show: boolean) => void;
  setTodoToDelete: (todoId: string | null) => void;
  startEditing: (todo: Todo) => void;
}

const TaskGrid: React.FC<TaskGridProps> = ({ todos, fetchTodos, setShowDeleteModal, setTodoToDelete, startEditing }) => {
  const cardColors = [
    'bg-sky-500',
    'bg-blue-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-sky-500',
    'bg-cyan-500'
  ];
  return (
    <>
      {todos.length === 0 ? (
        // Show NoTaskBanner when there are no tasks
        <div className="mt-10 animate-fadeIn">
          <NoTaskBanner />
        </div>
      ) : (
        // Show tasks grid when there are tasks
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mx-auto">
          {todos.map((todo, index) => (        
            <div
              key={todo.id}
              className={`${cardColors[index % cardColors.length]} rounded-lg p-4 sm:p-5 shadow-lg min-h-[120px] w-full flex 
              flex-col justify-between backdrop-blur-sm bg-opacity-80 transform hover:scale-105 transition-transform
               duration-200 cursor-pointer animate-fadeIn`}
                onClick={() => startEditing(todo)}
            >
              <div 
                className="flex-1"
              >
                <p className="text-white sm:text-lg md:text-2xl font-bold break-words">{todo.content}</p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); 
                    setTodoToDelete(todo.id);
                    setShowDeleteModal(true);
                  }}
                  className="text-sky-700 hover:text-red-700 px-3 py-1 rounded-full bg-white bg-opacity-50 hover:bg-opacity-100 transition-all duration-200"
                >
                    <Trash size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>  );
};

export default TaskGrid;
