'use client'

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Plus } from "lucide-react";

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



  // Colors for notes 

   const cardColors = [
    'bg-emerald-400',
    'bg-orange-300',
    'bg-yellow-200',
    'bg-fuchsia-300',
    'bg-blue-300',
    'bg-coral-400'
  ];


  return (

      <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="bg-white rounded-lg p-4 text-black">
            <h1 className="font-normal">{isNewUser ? 'Welcome!' : 'Welcome Back!'}</h1>
            {userFullName && <h2 className="text-xl font-semibold">{userFullName}</h2>}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          >
            Log-out
          </button>
        </div>
      </div>


      <div className="p-4 max-w-xl mx-auto">
        <h1 className="text-3xl text-white font-bold mb-4 text-center">Things to do</h1>
      
      {/* Add Task Button */}
        <button 
        onClick={() => setShowInput((prev) => !prev)}
        className="fixed bottom-8 right-8 bg-green-400 hover:bg-green-500 rounded-full p-4 text-white shadow-lg"
      >
        <Plus size={24} />
      </button>

        {/* Add Task Modal */}
      {showInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-black">Add New Task</h2>
            <form onSubmit={handleAddTask}>
              <textarea
                className="w-full border-2 border-gray-300 p-4 rounded-lg mb-4 resize-none h-32 text-black"
                placeholder="Enter your task..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInput(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

         {/* Task Grid */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todos.map((todo, index) => (
            <div
              key={todo.id}
              className={`${cardColors[index % cardColors.length]} rounded-lg p-6 shadow-lg min-h-[200px] flex flex-col justify-between`}
            >
              <div className="flex-1">
                <p className="text-black text-lg">{todo.content}</p>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => {
                    setTodoToDelete(todo.id);
                    setShowDeleteModal(true);
                  }}
                  className="text-gray-700 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

        {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-black">Confirm Deletion</h2>
            <p className="text-gray-600">Are you sure you want to delete this task?</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    </div>
  );
}
