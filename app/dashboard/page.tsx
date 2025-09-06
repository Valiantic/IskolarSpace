'use client'

import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Plus, Sparkles} from "lucide-react";
import { getRandomQuote } from "../constants/quotes";
import SpaceBackground from "../components/DashboardBlocks/SpaceBackground";
import TaskGrid from "../components/DashboardBlocks/TaskGrid";
import Sidebar from "../components/DashboardBlocks/Sidebar";
import EditTaskModal from "../components/DashboardBlocks/EditTaskModal";
import AddTaskModal from "../components/DashboardBlocks/AddTaskModal";
import DeleteConfirmationModal from "../components/DashboardBlocks/DeleteConfirmationModal";
import SearchBar from "../components/DashboardBlocks/SearchBar";
import PriorityFilter from "../components/DashboardBlocks/PriorityFilter";
import LoadingSpinner from "../components/DashboardBlocks/Loader";
import { useAuth } from "../hooks/auth/useAuth";
import useSidebar from "../hooks/dashboard/useSidebar";
import StudyPlanner from '../components/DashboardBlocks/StudyPlannerModal';
import { StudyPlannerProvider } from '../contexts/StudyPlannerContext';
import { Todo } from "../types/dashboard";

export default function DashboardPage() {
  const { isAuthenticated, authLoading, logout, requireAuth } = useAuth();
  const { userFullName, profilePicture } = useSidebar();

  const [userId, setUserId] = useState<string | null>(null);
  const [task, setTask] = useState("");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<'low' | 'moderate' | 'high'>("low");
  const [showInput, setShowInput] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);
  const [isUpdatingTodos, setIsUpdatingTodos] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilters, setPriorityFilters] = useState<('low' | 'moderate' | 'high')[]>([]);
  const [deadlineFilters, setDeadlineFilters] = useState<string[]>([]);
  const [deadline, setDeadline] = useState<Date | null>(null);

  // STATES TO EDIT TASK 
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDeadline, setEditedDeadline] = useState<Date | null>(null);

  // DELETE CONFIRMATION MODAL 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);
  const [quote, setQuote] = useState('');

  // AI Study Planner 
  const [openStudyPlanner, setOpenStudyPlanner] = useState(false);  
  const openModal = () => setOpenStudyPlanner(true);
  const closeModal = () => setOpenStudyPlanner(false);

  // Function to open AddTaskModal with AI plan data
  const openAddTaskWithAIPlan = (planTitle: string, planContent: string) => {
    setTitle(planTitle);
    setTask(planContent);
    setShowInput(true);
    setOpenStudyPlanner(false); // Close the study planner modal
  };


  // Fetch userId and todos
  const fetchTodos = useCallback(async (showLoading = true) => {
    const { data: { session } } = await supabase.auth.getSession();
    const uid = session?.user?.id;
    if (!uid) return;
    setUserId(uid);
    
    if (showLoading) {
      setIsLoadingTodos(true);
    } else {
      setIsUpdatingTodos(true);
    }
    
    const { data, error } = await supabase
      .from("tbl_todos")
      .select("id, title, content, user_id, created_at, priority, deadline")
      .order("created_at", { ascending: false })
      .eq('user_id', uid);
    if (error) {
      console.error("Error fetching todos:", error);
    } else {
      setTodos(data || []);
    }
    
    if (showLoading) {
      setIsLoadingTodos(false);
    } else {
      setIsUpdatingTodos(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // HANLDE ADDING A NEW TASK  
  const handleAddTask = async (e?: React.FormEvent<HTMLFormElement>) => {
      if (e) e.preventDefault();
      const {data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!task.trim() || !userId) return;

      // INSERT THE NEW TASK ALONG WITH THE USER'S ID, TITLE, AND PRIORITY
      // Set deadline time to noon to avoid UTC date shift
      let deadlineToSave = null;
      if (deadline) {
        const noonDate = new Date(deadline);
        noonDate.setHours(12, 0, 0, 0);
        deadlineToSave = noonDate.toISOString();
      }
      const { error } = await supabase.from("tbl_todos").insert([
        { 
          user_id: userId, 
          title: title.trim() || null, 
          content: task, 
          priority: priority,
          deadline: deadlineToSave
        },
      ]);
     
      if (error) {
        console.error("Error adding new task", error.message);
      }else {
        setTask("");
        setTitle("");
        setPriority('low'); // Reset priority to default
        setDeadline(null);
        setShowInput(false); 
        await fetchTodos(false);
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

    // Set deadline time to noon to avoid UTC date shift
    let editedDeadlineToSave = null;
    if (editedDeadline) {
      const noonDate = new Date(editedDeadline);
      noonDate.setHours(12, 0, 0, 0);
      editedDeadlineToSave = noonDate.toISOString();
    }
    const { error } = await supabase
      .from("tbl_todos")
      .update({ 
        title: editedTitle.trim() || null,
        content: editedContent,
        deadline: editedDeadlineToSave
      })
      .eq("id", todoId);

    if (error) {
      console.error("Error updating task", error.message);
    } else {
      // CLEAR EDITING STATE 
      setEditingTaskId(null);
      setEditedContent("");
      setEditedTitle("");
      await fetchTodos(false); 
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
      await fetchTodos(false); 
    }
  };

  // HANDLE SEARCH
  const handleSearch = useCallback((searchTerm: string) => {
    setSearchTerm(searchTerm);
  }, []);

  // HANDLE PRIORITY & DEADLINE FILTER
  const handlePriorityFilter = useCallback((priorities: ('low' | 'moderate' | 'high')[], deadlines?: string[]) => {
    setPriorityFilters(priorities);
    setDeadlineFilters(deadlines || []);
  }, []);

  const filteredTodos = todos.filter(todo => {
    // Search filter
    let matchesSearch = true;
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const titleMatch = todo.title?.toLowerCase().includes(lowerSearchTerm);
      const contentMatch = todo.content.toLowerCase().includes(lowerSearchTerm);
      const priorityMatch = todo.priority.toLowerCase().includes(lowerSearchTerm);
      matchesSearch = titleMatch || contentMatch || priorityMatch;
    }
    // Priority filter
    let matchesPriority = true;
    if (priorityFilters.length > 0) {
      matchesPriority = priorityFilters.includes(todo.priority);
    }
    // Deadline filter
    let matchesDeadline = true;
    if (deadlineFilters.length > 0) {
      const today = new Date();
      const deadlineDate = todo.deadline ? new Date(todo.deadline) : null;
      matchesDeadline = deadlineFilters.some(df => {
        if (df === 'today') {
          return deadlineDate && deadlineDate.getFullYear() === today.getFullYear() && deadlineDate.getMonth() === today.getMonth() && deadlineDate.getDate() === today.getDate();
        }
        if (df === 'week') {
          if (!deadlineDate) return false;
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return deadlineDate >= startOfWeek && deadlineDate <= endOfWeek;
        }
        if (df === 'overdue') {
          return deadlineDate && deadlineDate < today;
        }
        if (df === 'none') {
          return !deadlineDate;
        }
        return true;
      });
    }
    return matchesSearch && matchesPriority && matchesDeadline;
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
      await fetchTodos(false); 
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
    <StudyPlannerProvider>
      <div className="relative">
        <SpaceBackground />
        <div className="min-h-screen relative">
        
        <Sidebar
          userFullName={userFullName}
          profilePicture={profilePicture}
          handleLogout={logout}
        />
        
        {/* Content Container */}
        <div className="lg:ml-80 p-7 pt-10">
          {todos.length > 0 && !isLoadingTodos && (
            <>
              {/* Search Bar and Priority Filter */}
              <div className="mb-8">
                <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-center mb-4">
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex flex-1 justify-center items-center gap-4">
                      <div className="max-w-md w-full">
                        <SearchBar
                          onSearch={handleSearch}
                          placeholder="Search tasks by title, content, or priority..."
                        />
                      </div>
                      <div className="lg:ml-4">
                        <PriorityFilter
                          onFilterChange={handlePriorityFilter}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Search Results Count */}
                {(searchTerm.trim() || priorityFilters.length > 0) && (
                  <div className="text-center space-y-2">
                    <div className="text-white/70 text-sm font-poppins">
                      {filteredTodos.length === 0 
                        ? 'No tasks found' 
                        : `${filteredTodos.length} task${filteredTodos.length === 1 ? '' : 's'} found`
                      }
                    </div>
                    {/* Active Filters Display */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {searchTerm.trim() && (
                        <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/50 rounded-full text-blue-300 text-xs font-poppins">
                          Search: "{searchTerm}"
                        </span>
                      )}
                      {priorityFilters.map(priority => (
                        <span 
                          key={priority}
                          className={`px-3 py-1 rounded-full text-xs font-poppins border ${
                            priority === 'high' 
                              ? 'bg-red-500/20 border-red-400/50 text-red-300'
                              : priority === 'moderate'
                              ? 'bg-yellow-500/20 border-yellow-400/50 text-yellow-300'
                              : 'bg-green-500/20 border-green-400/50 text-green-300'
                          }`}
                        >
                          {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Quote */}
              {!searchTerm.trim() && priorityFilters.length === 0 && (
                <h1 className="text-lg sm:text-base md:text-xl lg:text-3xl text-white font-bold mt-5 mr-0 text-center font-poppins">
                  {quote}
                </h1>
              )}
            </>
          )}

          {isLoadingTodos ? (
            <LoadingSpinner />
          ) : (
          <>
          {filteredTodos.length > 0 && (
            <div className="flex justify-end mb-4 mt-2">
              <button
                onClick={openModal}
                className="font-poppins border border-blue-500/90 transition-transform duration-200 hover:scale-110 font-bold bg-slate-800 rounded-full p-3 sm:p-3 text-white shadow-lg flex items-center text-sm sm:text-base"
              >
                Plan with AI
                <Sparkles className="inline-block ml-1 mb-1 w-4 h-4 sm:w-5 sm:h-5 text-cyan-400/90" />
              </button>
            </div>
          )}
          <TaskGrid 
            todos={filteredTodos} 
            fetchTodos={fetchTodos} 
            startEditing={startEditing}
            deadline={deadline}
            handlePriorityChange={handlePriorityChange}
            searchTerm={searchTerm}
            priorityFilters={priorityFilters}
            totalTasks={todos.length}
          />
          </>
          )}
        </div>
        
        {/* Add Task Button */}
        <button 
          onClick={() => setShowInput((prev) => !prev)}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-slate-500 to-sky-500 hover:from-slate-600 hover:to-sky-600 rounded-full p-4 text-white shadow-lg"
        >
          <Plus size={24} />
        </button>
        
        {/* Task Input Modal */}
        <AddTaskModal
          showInput={showInput}
          title={title}
          task={task}
          priority={priority}
          deadline={deadline}
          setTitle={setTitle}
          setTask={setTask}
          setPriority={setPriority}
          setDeadline={setDeadline}
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
          editedDeadline={editedDeadline}
          setEditedContent={setEditedContent}
          setEditedTitle={setEditedTitle}
          setEditedDeadline={setEditedDeadline}
          handleSaveEdit={handleSaveEdit}
          setShowDeleteModal={setShowDeleteModal}
          setTodoToDelete={setTodoToDelete}
          cancelEditing={cancelEditing}
        />

        {/* Study Planner Modal */}
        <StudyPlanner
          isOpen={openStudyPlanner}
          onClose={closeModal}
          userId={userId || ""}
          tableType="todos"
          openAddTaskWithAIPlan={openAddTaskWithAIPlan}
        />
        </div>
      </div>
    </StudyPlannerProvider>
  );
};
