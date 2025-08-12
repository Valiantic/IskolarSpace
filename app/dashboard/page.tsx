'use client'

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Plus, Rocket, CircleX } from "lucide-react";
import { getRandomQuote } from "../constants/quotes";
import SpaceBackground from "../components/DashboardBlocks/SpaceBackground";
import TaskGrid from "../components/DashboardBlocks/TaskGrid";
import Sidebar from "../components/DashboardBlocks/Sidebar";
import EditTaskModal from "../components/DashboardBlocks/EditTaskModal";
import { useAuth } from "../hooks/auth/useAuth";

interface Todo {
  id: string;
  title?: string;
  content: string;
  user_id: string;
  created_at: string;
  priority: 'low' | 'moderate' | 'high';
}

export default function DashboardPage() {
  const { isAuthenticated, authLoading, user, logout, requireAuth } = useAuth();
  
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const router = useRouter();
  const [task, setTask] = useState("");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<'low' | 'moderate' | 'high'>('low');
  const [showInput, setShowInput] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);

  // STATES TO EDIT TASK 
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedPriority, setEditedPriority] = useState<'low' | 'moderate' | 'high'>('low');

  // DELETE CONFIRMATION MODAL 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);
  const [quote, setQuote] = useState('');

  // FUNCTION TO FETCH TASK FROM SUPABASE - Moved up and wrapped in useCallback  
  const fetchTodos = useCallback(async () => {
    if (!userId) return; // Guard clause

    const { data, error } = await supabase
      .from("tbl_todos")
      .select("id, title, content, user_id, created_at, priority")
      .order("created_at", { ascending: false })
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error fetching todos:", error);
    } else {
      setTodos(data || []);
    }
  }, [userId]); // Add userId as dependency

  // FETCH USER DATA using the authenticated user
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setUserId(user.id);

        // Fetch user's full name and created_at timestamp
        const { data: userData, error } = await supabase
          .from('tbl_users')
          .select('full_name, created_at')
          .eq('id', user.id)
          .single();

        if (!error && userData) {
          setUserFullName(userData.full_name);
          
          // Check if user was created in the last 24 hours
          const createdAt = new Date(userData.created_at);
          const now = new Date();
          const isNew = (now.getTime() - createdAt.getTime()) < 24 * 60 * 60 * 1000;
          setIsNewUser(isNew);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Separate useEffect for fetching todos
  useEffect(() => {
    if (userId) { // Only fetch if userId exists
      fetchTodos();
    }
  }, [userId, fetchTodos]); // Added fetchTodos to dependency array
  
  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);
  
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // HANLDE ADDING A NEW TASK  
  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!task.trim() || !userId) return;

      // INSERT THE NEW TASK ALONG WITH THE USER'S ID, TITLE, AND PRIORITY
      const { error } = await supabase.from("tbl_todos").insert([
        { 
          user_id: userId, 
          title: title.trim() || null, 
          content: task, 
          priority: priority 
        },
      ]);
     
      if (error) {
        console.error("Error adding new task", error.message);
      }else {
        setTask("");
        setTitle("");
        setPriority('low'); // Reset priority to default
        setShowInput(false); 
        fetchTodos();
      }
  }

  // HANDLE EDITING TASK 
  const startEditing = (todo: Todo) => {
    setEditingTaskId(todo.id);
    setEditedContent(todo.content);
    setEditedTitle(todo.title || "");
    setEditedPriority(todo.priority);
  }

  // HANDLE CANCEL EDIT MODE 
  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditedContent("");
    setEditedTitle("");
    setEditedPriority('low');
  }
  // HANDLE SAVE EDITED TASK 
  const handleSaveEdit = async (todoId: string) => {
    if (!editedContent.trim()) return;

    const { error } = await supabase
      .from("tbl_todos")
      .update({ 
        title: editedTitle.trim() || null,
        content: editedContent, 
        priority: editedPriority 
      })
      .eq("id", todoId);

    if (error) {
      console.error("Error updating task", error.message);
    } else {
      // CLEAR EDITING STATE 
      setEditingTaskId(null);
      setEditedContent("");
      setEditedTitle("");
      setEditedPriority('low');
      fetchTodos();
    }
  }

  // HANDLE DELETE TASK
  const handleDelete = async () => {
    if(!todoToDelete) return;

    const { error } = await supabase
    .from("tbl_todos")
    .delete()
    .eq("id", todoToDelete);

    if (error) {
      console.error("Error deleting task", error.message);
    }else {
      fetchTodos();
    }

    setShowDeleteModal(false);
    setTodoToDelete(null);
  };

  if (authLoading || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }  return (
    <div className="relative">
      <SpaceBackground />
      <div className="min-h-screen relative">
      
      <Sidebar
        userFullName={userFullName} 
        handleLogout={logout}
      />
      
      {/* Content Container */}
      <div className="lg:ml-80 p-7 pt-10">
        {todos.length > 0 && (
          <h1 className="text-3xl text-white font-bold mb-6 text-center font-poppins">{quote}</h1>
        )}
        <TaskGrid 
          todos={todos} 
          fetchTodos={fetchTodos} 
          setShowDeleteModal={setShowDeleteModal} 
          setTodoToDelete={setTodoToDelete} 
          startEditing={startEditing}
        />
      </div>
      
      {/* Add Task Button */}
      <button 
        onClick={() => setShowInput((prev) => !prev)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 hover:from-sky-600 hover:via-blue-600 hover:to-cyan-600 rounded-full p-4 text-white shadow-lg"
      >
        <Plus size={24} />
      </button>
      
      {/* Task Input Modal */}
      {showInput && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-hidden">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-6 rounded-lg shadow-xl w-full max-w-md border border-blue-500 m-4 overflow-hidden">
            <h2 className="text-xl text-center font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-cyan-300 font-poppins">What's your plan for today?</h2>
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
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-hidden">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-6 rounded-lg shadow-xl max-w-sm w-full border border-red-500 m-4">
            <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400 font-poppins">Confirm Deletion</h2>
            <p className="text-gray-300 font-poppins">Are you sure you want to delete this task?</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-slate-700 text-gray-200 rounded-lg hover:bg-slate-600 transition-colors font-poppins"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:from-red-600 hover:to-rose-600 transition-colors font-poppins"
              >
                Delete <CircleX size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Task Modal */}
      <EditTaskModal
        editingTaskId={editingTaskId}
        todos={todos}
        editedContent={editedContent}
        editedTitle={editedTitle}
        editedPriority={editedPriority}
        setEditedContent={setEditedContent}
        setEditedTitle={setEditedTitle}
        setEditedPriority={setEditedPriority}
        handleSaveEdit={handleSaveEdit}
        cancelEditing={cancelEditing}
      />
      </div>
    </div>
  );
};
