'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import useClipboard from '../../hooks/utils/useClipboard';
import TaskGrid from '../../components/DashboardBlocks/TaskGrid';
import { Plus } from 'lucide-react';
import AddTaskModal from '../../components/DashboardBlocks/AddTaskModal';
import Sidebar from '../../components/DashboardBlocks/Sidebar';
import SpaceBackground from '../../components/DashboardBlocks/SpaceBackground';
import { getTasks, getSpaceMembers } from '../../services/iskolarspace-api';
import { getUserSpaces } from '../../services/iskolarspace-api';
import { createTask, updateTask, deleteTask } from '../../services/iskolarspace-api';
import { useAuth } from '../../hooks/auth/useAuth';
import useSidebar from '../../hooks/dashboard/useSidebar';
import LoadingSpinner from '../../components/DashboardBlocks/LoadingSpinner';
import DeleteConfirmationModal from '../../components/DashboardBlocks/DeleteConfirmationModal';
import EditTaskModal from '../../components/DashboardBlocks/EditTaskModal';
import SearchBar from '../../components/DashboardBlocks/SearchBar';
import PriorityFilter from '../../components/DashboardBlocks/PriorityFilter';

const SpacePage = () => {
  // Use useParams from next/navigation
  const params = useParams();
  const spaceId = (params as { space_id: string }).space_id;

  const { user, logout } = useAuth();
  const userId = user?.id;
  const { userFullName } = useSidebar();

  // Space Details
  const [spaceName, setSpaceName] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilters, setPriorityFilters] = useState<('low' | 'moderate' | 'high')[]>([]);
  const [spaceCode, setSpaceCode] = useState('');

  // Task Grid
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [task, setTask] = useState('');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'moderate' | 'high'>('low');
  
  // Delet Confirmation Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

   // For EditTaskModal
  const [showEditModal, setShowEditModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);
  const [membersError, setMembersError] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedPriority, setEditedPriority] = useState<'low' | 'moderate' | 'high'>('low');

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    if (!spaceId) {
      setTasks([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const fetchedTasks = await getTasks(spaceId);
      setTasks(fetchedTasks);
    } catch (err) {
      setTasks([]);
    }
    setIsLoading(false);
  }, [spaceId]);

  // Add task
  const handleAddTask = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!task.trim() || !user?.id || !spaceId) return;
    try {
      await createTask(spaceId, {
        title: title.trim() || null,
        description: task,
        status: priority,
        created_by: user.id,
      });
      setTask('');
      setTitle('');
      setPriority('low');
      setShowInput(false);
      fetchTasks();
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  // Fetch space name and members
  useEffect(() => {
    async function fetchMembersAndCode() {
      if (!spaceId || !user?.id) {
        setSpaceName('Space');
        setMembers([]);
        setIsLoadingMembers(false);
        setMembersError('Invalid spaceId');
        setSpaceCode('');
        return;
      }
      setIsLoadingMembers(true);
      try {
        const { space, members } = await getSpaceMembers(spaceId);
        setMembers(members);
    const userSpaces = await getUserSpaces(user.id);
    const currentSpace = userSpaces.find((s: any) => s.space_id === spaceId);
    setSpaceName(currentSpace?.tbl_spaces?.name || space?.name || 'Space');
    setSpaceCode(currentSpace?.tbl_spaces?.code || '');
        setMembersError(null);
      } catch (err: any) {
        setSpaceName('Space');
        setMembers([]);
        setMembersError(err?.message || 'Failed to fetch members');
        setSpaceCode('');
        console.error('Error fetching members:', err);
      }
      setIsLoadingMembers(false);
    }
    fetchMembersAndCode();
  }, [spaceId, userId]);

  // Fetch tasks when component mounts or spaceId changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Edit task
  const startEditing = (task: any) => {
  setEditingTaskId(task.id);
  setEditedContent(task.content || task.description || '');
  setEditedTitle(task.title || '');
  setEditedPriority(task.priority || task.status || 'low');
  setShowEditModal(true);
  };
  const cancelEditing = () => {
  setEditingTaskId(null);
  setEditedContent('');
  setEditedTitle('');
  setEditedPriority('low');
  setShowEditModal(false);
  };
  const handleSaveEdit = async (taskId: string) => {
    if (!editedContent.trim() || !spaceId) return;
    try {
      await updateTask(spaceId, {
        id: taskId,
        title: editedTitle.trim() || null,
        description: editedContent,
        status: editedPriority,
      });
      cancelEditing();
      fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  // Delete task
  const handleDelete = async () => {
    if (!todoToDelete || !spaceId) return;
    try {
      await deleteTask(spaceId, todoToDelete);
      if (editingTaskId === todoToDelete) {
        cancelEditing();
      }
      fetchTasks();
    } catch (err) {
      // handle error
    }
    setShowDeleteModal(false);
    setTodoToDelete(null);
    setTaskToDelete(null);
  };

  return (
    <div className="relative">
      <SpaceBackground />
      <div className="min-h-screen relative">
        <Sidebar userFullName={userFullName} handleLogout={logout} />
        <div className="lg:ml-80 p-7 pt-10 relative">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Search Bar and Priority Filter */}
              <div className="mb-8">
                <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-center mb-4">
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex flex-1 justify-center items-center gap-4">
                      <div className="max-w-md w-full">
                        <SearchBar
                          onSearch={setSearchTerm}
                          placeholder="Search tasks..."
                        />
                      </div>
                      <div className="lg:ml-4">
                        <PriorityFilter
                          onFilterChange={(filters) => setPriorityFilters(filters as ('low' | 'moderate' | 'high')[])}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Space Name below search/filter */}
                <h1 className="text-3xl text-white font-bold mt-5 text-center font-poppins">
                  {isLoadingMembers ? 'Loading...' : `${spaceName} Space`}
                </h1>
                {(searchTerm.trim() || priorityFilters.length > 0) && (
                  <div className="text-center space-y-2">
                    <div className="text-white/70 text-sm font-poppins">
                      {tasks.filter(task =>
                        (!searchTerm || (task.title?.toLowerCase().includes(searchTerm.toLowerCase()) || task.description?.toLowerCase().includes(searchTerm.toLowerCase()))) &&
                        (priorityFilters.length === 0 || priorityFilters.includes(task.priority || task.status || 'low'))
                      ).length === 0
                        ? 'No tasks found'
                        : `${tasks.filter(task =>
                            (!searchTerm || (task.title?.toLowerCase().includes(searchTerm.toLowerCase()) || task.description?.toLowerCase().includes(searchTerm.toLowerCase()))) &&
                            (priorityFilters.length === 0 || priorityFilters.includes(task.priority || task.status || 'low'))
                          ).length} task${tasks.filter(task =>
                            (!searchTerm || (task.title?.toLowerCase().includes(searchTerm.toLowerCase()) || task.description?.toLowerCase().includes(searchTerm.toLowerCase()))) &&
                            (priorityFilters.length === 0 || priorityFilters.includes(task.priority || task.status || 'low'))
                          ).length === 1 ? '' : 's'} found`
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
              {/* Add Task Button */}
              <button
                onClick={() => setShowInput((prev) => !prev)}
                className="fixed bottom-8 right-8 bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 hover:from-sky-600 hover:via-blue-600 hover:to-cyan-600 rounded-full p-4 text-white shadow-lg"
              >
                <Plus size={24} />
              </button>
              {/* Tasks Section */}
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
              <TaskGrid
                todos={tasks
                  .filter(task =>
                    (!searchTerm || (task.title?.toLowerCase().includes(searchTerm.toLowerCase()) || task.description?.toLowerCase().includes(searchTerm.toLowerCase()))) &&
                    (priorityFilters.length === 0 || priorityFilters.includes(task.priority || task.status || 'low'))
                  )
                  .map(task => ({
                    ...task,
                    priority: (task.priority || task.status || 'low'),
                    content: task.content || task.description || '',
                  }))
                }
                fetchTodos={fetchTasks}
                startEditing={startEditing}
                handlePriorityChange={async (id, newStatus) => {
                  const taskToUpdate = tasks.find((t) => t.id === id);
                  if (!taskToUpdate) return;
                  try {
                    await updateTask(spaceId, {
                      id,
                      title: taskToUpdate.title || null,
                      description: taskToUpdate.description || taskToUpdate.content || '',
                      status: newStatus,
                    });
                    fetchTasks();
                  } catch (err) {
                    console.error('Error updating task priority:', err);
                  }
                }}
                searchTerm={searchTerm}
                priorityFilters={priorityFilters}
                totalTasks={tasks.length}
              />
              {showEditModal && (
                <EditTaskModal
                  editingTaskId={editingTaskId}
                  todos={tasks.map((task) => ({
                    ...task,
                    content: task.content || task.description || '',
                  }))}
                  editedContent={editedContent}
                  editedTitle={editedTitle}
                  setEditedContent={setEditedContent}
                  setEditedTitle={setEditedTitle}
                  handleSaveEdit={handleSaveEdit}
                  setShowDeleteModal={setShowDeleteModal}
                  setTodoToDelete={setTodoToDelete}
                  cancelEditing={cancelEditing}
                />
              )}
              {/* Delete Confirmation Modal */}
              <DeleteConfirmationModal
                showDeleteModal={showDeleteModal}
                handleDelete={handleDelete}
                setShowDeleteModal={setShowDeleteModal}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpacePage;
