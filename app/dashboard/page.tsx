'use client'

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Plus, Rocket, Check, CircleX } from "lucide-react";
import { getRandomQuote } from "../constants/quotes";
import SpaceBackground from "../components/SpaceBackground";
import TaskGrid from "../components/TaskGrid";
import Header from "../components/Header";

interface Todo {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

export default function DashboardPage() {
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const router = useRouter();
  const [task, setTask] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);

  // STATES TO EDIT TASK 
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");

  // DELETE CONFIRMATION MODAL 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);
  const [quote, setQuote] = useState('');

  // FUNCTION TO FETCH TASK FROM SUPABASE - Moved up and wrapped in useCallback  
  const fetchTodos = useCallback(async () => {
    if (!userId) return; // Guard clause

    const { data, error } = await supabase
      .from("tbl_todos")
      .select("*")
      .order("created_at", { ascending: false })
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error fetching todos:", error);
    } else {
      setTodos(data || []);
    }
  }, [userId]); // Add userId as dependency

  // FETCH USER SESSION 
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      } else {
        setUserId(session.user.id);

        // Fetch user's full name and created_at timestamp
        const { data: userData, error } = await supabase
          .from('tbl_users')
          .select('full_name, created_at')
          .eq('id', session.user.id)
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

    fetchUser();
  }, [router]);

  // Separate useEffect for fetching todos
  useEffect(() => {
    if (userId) { // Only fetch if userId exists
      fetchTodos();
    }
  }, [userId, fetchTodos]); // Added fetchTodos to dependency array

  // HANLDE ADDING A NEW TASK  
  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!task.trim() || !userId) return;

      // INSERT THE NEW TASK ALONG WITH THE USER'S ID 
      const { error } = await supabase.from("tbl_todos").insert([
        { user_id: userId, content: task },
      ]);
     
      if (error) {
        console.error("Error adding new task", error.message);
      }else {
        setTask("");
        setShowInput(false); 
        fetchTodos();
      }
  }

  // HANDLE EDITING TASK 
  const startEditing = (todo: Todo) => {
    setEditingTaskId(todo.id);
    setEditedContent(todo.content);
  }

  // HANDLE CANCEL EDIT MODE 
  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditedContent("");
  }

  // HANDLE SAVE EDITED TASK 
  const handleSaveEdit = async (todoId: string) => {
    if (!editedContent.trim()) return;

    const { error } = await supabase
      .from("tbl_todos")
      .update({ content: editedContent })
      .eq("id", todoId);

    if (error) {
      console.error("Error updating task", error.message);
    } else {

      // CLEAR EDITING STATE 
      setEditingTaskId(null);
      setEditedContent("");
      fetchTodos();
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

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
  useEffect(() => {
      setQuote(getRandomQuote());
  }, []);  return (
    <div className="relative">
      <SpaceBackground />
      <div className="min-h-screen relative z-10">
      
      <div className="fixed top-0 left-0 w-full bg-gradient-to-b from-slate-900 to-slate-800 p-2 shadow-lg z-20">
        <Header 
          isNewUser={isNewUser} 
          userFullName={userFullName} 
          handleLogout={handleLogout} 
        />
      </div>
      
      {/* Content Container */}
      <div className="mt-40 p-4 container mx-auto">
        <h1 className="text-3xl text-white font-bold mb-10 text-center">{quote}</h1>        <TaskGrid 
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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-6 rounded-lg shadow-xl w-full max-w-md border border-blue-500">
            <h2 className="text-xl text-center font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-cyan-300">What's your plan for today?</h2>
            <form onSubmit={handleAddTask}>
              <textarea
                className="w-full border-2 border-blue-400 p-4 rounded-lg mb-4 resize-none h-32 text-white bg-slate-800 focus:border-cyan-400 focus:outline-none"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInput(false)}
                  className="px-4 py-2 bg-slate-700 text-gray-200 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex justify-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 text-white rounded-lg hover:from-sky-600 hover:via-blue-600 hover:to-cyan-600 transition-colors"
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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-6 rounded-lg shadow-xl max-w-sm w-full border border-red-500">
            <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">Confirm Deletion</h2>
            <p className="text-gray-300">Are you sure you want to delete this task?</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-slate-700 text-gray-200 rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:from-red-600 hover:to-rose-600 transition-colors"
              >
                Delete <CircleX size={20} />
              </button>
            </div>
          </div>
        </div>
      )}            {/* Edit Task Modal */}
      {editingTaskId && (
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-blue-900/30 flex items-center justify-center z-50 animate-fadeIn"
          onClick={cancelEditing}
        >
          <div className="w-full max-w-md mx-auto animate-scaleIn">
            {(() => {
              const todoIndex = todos.findIndex(todo => todo.id === editingTaskId);
              const cardColors = [
                'bg-sky-300',
                'bg-blue-200',
                'bg-cyan-200',
                'bg-indigo-200',
                'bg-sky-200',
                'bg-cyan-300'
              ];
              const cardColor = todoIndex >= 0 ? cardColors[todoIndex % cardColors.length] : 'bg-sky-300';
              
              return (                
                <div 
                  className={`${cardColor} rounded-lg p-6 shadow-xl w-full backdrop-blur-sm bg-opacity-95 transform transition-all duration-300 hover:shadow-2xl`}
                  onClick={(e) => e.stopPropagation()} 
                >
                  <textarea
                    className="w-full p-3 rounded-lg mb-4 resize-none h-32 text-white bg-transparent focus:outline-none border-0 sm:text-lg md:text-2xl font-bold"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    autoFocus
                  />
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => editingTaskId && handleSaveEdit(editingTaskId)}
                      className="text-sky-700 hover:text-sky-900 px-4 py-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-all duration-200"
                    >
                      <Check size={20} />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
