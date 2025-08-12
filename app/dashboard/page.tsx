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
import AddTaskModal from "../components/DashboardBlocks/AddTaskModal";
import DeleteConfirmationModal from "../components/DashboardBlocks/DeleteConfirmationModal";
import SearchBar from "../components/DashboardBlocks/SearchBar";
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
  const [searchTerm, setSearchTerm] = useState('');

  // STATES TO EDIT TASK 
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");

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
  }

  // HANDLE CANCEL EDIT MODE 
  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditedContent("");
    setEditedTitle("");
  }
  // HANDLE SAVE EDITED TASK 
  const handleSaveEdit = async (todoId: string) => {
    if (!editedContent.trim()) return;

    const { error } = await supabase
      .from("tbl_todos")
      .update({ 
        title: editedTitle.trim() || null,
        content: editedContent
      })
      .eq("id", todoId);

    if (error) {
      console.error("Error updating task", error.message);
    } else {
      // CLEAR EDITING STATE 
      setEditingTaskId(null);
      setEditedContent("");
      setEditedTitle("");
      fetchTodos();
    }
  }

  // HANDLE PRIORITY CHANGE
  const handlePriorityChange = async (todoId: string, newPriority: 'low' | 'moderate' | 'high') => {
    const { error } = await supabase
      .from("tbl_todos")
      .update({ priority: newPriority })
      .eq("id", todoId);

    if (error) {
      console.error("Error updating priority", error.message);
    } else {
      fetchTodos();
    }
  };

  // HANDLE SEARCH
  const handleSearch = useCallback((searchTerm: string) => {
    setSearchTerm(searchTerm);
  }, []);

  // FILTER TODOS BASED ON SEARCH TERM
  const filteredTodos = todos.filter(todo => {
    if (!searchTerm.trim()) return true;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    const titleMatch = todo.title?.toLowerCase().includes(lowerSearchTerm);
    const contentMatch = todo.content.toLowerCase().includes(lowerSearchTerm);
    const priorityMatch = todo.priority.toLowerCase().includes(lowerSearchTerm);
    
    return titleMatch || contentMatch || priorityMatch;
  });

  // HANDLE DELETE TASK FROM CONFIRMATION MODAL
  const handleDelete = async () => {
    if(!todoToDelete) return;

    const { error } = await supabase
    .from("tbl_todos")
    .delete()
    .eq("id", todoToDelete);

    if (error) {
      console.error("Error deleting task", error.message);
    }else {
      // Close edit modal if it's open and the deleted task is being edited
      if (editingTaskId === todoToDelete) {
        setEditingTaskId(null);
        setEditedContent("");
        setEditedTitle("");
      }
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
          <>
            {/* Search Bar */}
            <div className="mb-8">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search tasks by title, content, or priority..."
                className="mb-4"
              />
              {/* Search Results Count */}
              {searchTerm.trim() && (
                <div className="text-center text-white/70 text-sm font-poppins">
                  {filteredTodos.length === 0 
                    ? 'No tasks found' 
                    : `${filteredTodos.length} task${filteredTodos.length === 1 ? '' : 's'} found`
                  }
                </div>
              )}
            </div>
            
            {/* Quote */}
            {!searchTerm.trim() && (
              <h1 className="text-3xl text-white font-bold mb-6 text-center font-poppins">{quote}</h1>
            )}
          </>
        )}
        <TaskGrid 
          todos={filteredTodos} 
          fetchTodos={fetchTodos} 
          startEditing={startEditing}
          handlePriorityChange={handlePriorityChange}
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
      <AddTaskModal
        showInput={showInput}
        title={title}
        task={task}
        priority={priority}
        setTitle={setTitle}
        setTask={setTask}
        setPriority={setPriority}
        handleAddTask={handleAddTask}
        setShowInput={setShowInput}
      />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        showDeleteModal={showDeleteModal}
        handleDelete={handleDelete}
        setShowDeleteModal={setShowDeleteModal}
      />
      
      {/* Edit Task Modal */}
      <EditTaskModal
        editingTaskId={editingTaskId}
        todos={todos}
        editedContent={editedContent}
        editedTitle={editedTitle}
        setEditedContent={setEditedContent}
        setEditedTitle={setEditedTitle}
        handleSaveEdit={handleSaveEdit}
        setShowDeleteModal={setShowDeleteModal}
        setTodoToDelete={setTodoToDelete}
        cancelEditing={cancelEditing}
      />
      </div>
    </div>
  );
};
