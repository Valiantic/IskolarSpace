'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import TaskGrid from '../../components/DashboardBlocks/TaskGrid';
import { Plus, Orbit } from 'lucide-react';
import AddTaskModal from '../../components/DashboardBlocks/AddTaskModal';
import Sidebar from '../../components/DashboardBlocks/Sidebar';
import SpaceBackground from '../../components/DashboardBlocks/SpaceBackground';
import { getTasks, getSpaceMembers } from '../../services/iskolarspace-api';
import { getUserSpaces } from '../../services/iskolarspace-api';
import { createTask, updateTask, deleteTask } from '../../services/iskolarspace-api';
import { useAuth } from '../../hooks/auth/useAuth';
import useSidebar from '../../hooks/dashboard/useSidebar';
import LoadingSpinner from '../../components/DashboardBlocks/Loader';
import DeleteConfirmationModal from '../../components/DashboardBlocks/DeleteConfirmationModal';
import EditTaskModal from '../../components/DashboardBlocks/EditTaskModal';
import SearchBar from '../../components/DashboardBlocks/SearchBar';
import PriorityFilter from '../../components/DashboardBlocks/PriorityFilter';
import SpaceInfoModal from '../../components/SpaceBlocks/SpaceInfoModal';
import useRequireAuth from '../../hooks/auth/useRequireAuth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const SpacePage = () => {
  // Use useParams from next/navigation
  const params = useParams();
  const spaceId = (params as { space_id: string }).space_id;

  const { user, logout } = useAuth();
  const { authLoading } = useRequireAuth();
  const router = useRouter();

  // Ensure hooks are called in a consistent order
  const userId = user?.id;
  const { userFullName } = useSidebar();

  // Space Details
  const [spaceName, setSpaceName] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilters, setPriorityFilters] = useState<('low' | 'moderate' | 'high')[]>([]);
  const [spaceCode, setSpaceCode] = useState('');
  const [isMember, setIsMember] = useState<null | boolean>(null);

  // Space Info Modal state
  const [showSpaceInfoModal, setShowSpaceInfoModal] = useState(false);
  const openSpaceInfoModal = () => setShowSpaceInfoModal(true);
  const closeSpaceInfoModal = () => setShowSpaceInfoModal(false);

  // Task Grid
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [task, setTask] = useState('');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'moderate' | 'high'>('low');
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const [deadline, setDeadline] = useState<Date | null>(null);

  // Delete Confirmation Modal
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
  const [editedDeadline, setEditedDeadline] = useState<Date | null>(null);

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
  const handleAddTask = async (e?: React.FormEvent<any>, assignedToArg?: string | null) => {
    if (e) e.preventDefault();
    if (!task.trim() || !user?.id || !spaceId) return;
    let deadlineToSave = null;
    if (deadline) {
      const noonDate = new Date(deadline);
      noonDate.setHours(12, 0, 0, 0);
      deadlineToSave = noonDate.toISOString();
    }
    try {
      const result = await createTask(spaceId, {
        title: title.trim() || null,
        description: task,
        status: priority,
        created_by: user.id,
        assigned_to: assignedToArg,
        deadline: deadlineToSave
      });
      toast.success('Task created successfully!');
      setTask('');
      setTitle('');
      setPriority('low');
      setShowInput(false);
      setAssignedTo(null);
      setDeadline(null);
      fetchTasks();
    } catch (err: any) {
      if (err?.response) {
        toast.error(`Error creating task: ${err.response.data.error || 'Unknown error'}`);
        console.error('Error creating task:', err.response.data, 'Status:', err.response.status);
      } else {
        toast.error('Error creating task: ' + (err.message || 'Unknown error'));
        console.error('Error creating task:', err);
      }
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
        const membersArray = await getSpaceMembers(spaceId);
        const mappedMembers = membersArray.map((m: { user_id: string; role?: string; tbl_users: { id?: string; full_name: string } }) => ({
          user_id: m.user_id,
          role: m.role,
          tbl_users: {
            id: m.tbl_users.id || m.user_id,
            full_name: m.tbl_users.full_name
          }
        }));
        setMembers(mappedMembers);
        const userSpaces = await getUserSpaces(user.id);
        const currentSpace = userSpaces.find((s: any) => s.space_id === spaceId);
        setSpaceName(currentSpace?.tbl_spaces?.name || 'Space');
        setSpaceCode(currentSpace?.tbl_spaces?.code || '');
        setMembersError(null);
        // Membership check
        const memberCheck = mappedMembers.some((m: any) => m.tbl_users.id === user.id);
        setIsMember(memberCheck);
        if (!memberCheck) {
          router.replace('/not-found');
        }
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
    let editDeadlineToSave = null;
    if (editedDeadline) {
        const noonDate = new Date(editedDeadline);
        noonDate.setHours(12, 0, 0, 0);
        editDeadlineToSave = noonDate.toISOString();
    }
    try {
      await updateTask(spaceId, {
        id: taskId,
        title: editedTitle.trim() || null,
        description: editedContent,
        status: editedPriority,
        assigned_to: assignedTo,
        created_by: user?.id,
        deadline: editDeadlineToSave
      });
      toast.success('Task updated successfully!');
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

    // Leave Space handler
  const [leaving, setLeaving] = useState(false);
  const handleLeaveSpace = async () => {
    if (!userId || !spaceId) return;
    setLeaving(true);
    try {
      // Use the leaveSpace API from services
      // leaveSpace expects (spaceId: string, userId: number)
      // It uses POST /api/spaces/user-spaces with { spaceId, userId, action: 'leave_space' }
      const res = await fetch('/api/spaces/user-spaces', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spaceId, userId, action: 'leave_space' }),
      });
      if (res.ok) {
        toast.success('You have left the space.');
        setShowSpaceInfoModal(false);
        router.push('/dashboard'); 
        // Optionally redirect or update UI here
      } else {
        toast.error('Failed to leave space.');
      }
    } catch (err) {
      toast.error('Error leaving space.');
    }
    setLeaving(false);
  };

  if (authLoading || !user) {
    return null;
  }

  // Wait for membership check before rendering anything
  if (isMember === null) {
    return <div className="bg-black flex items-center justify-center min-h-screen"><LoadingSpinner /></div>;
  }
  if (!isMember) {
    return null;
  }

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
                      <div className="lg:ml-4">
                        <button
                          className='sm:h-10 sm:w-10 md:h-12 md:w-12 flex justify-center items-center'
                          onClick={openSpaceInfoModal}
                          aria-label="Show space info"
                        >
                          <Orbit className='text-white w-7 h-7 text-sky-400' />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Space Name below search/filter */}
                <h1 className="text-3xl text-white font-bold mt-5 text-center font-poppins">
                  {isLoadingMembers ? 'Loading...' : `${spaceName}`}
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
                deadline={deadline}
                setDeadline={setDeadline}
                setTitle={setTitle}
                setTask={setTask}
                setPriority={setPriority}
                handleAddTask={handleAddTask}
                setShowInput={setShowInput}
                assignedTo={assignedTo}
                setAssignedTo={setAssignedTo}
                members={members}
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
                      assigned_to: task.assigned_to,
                      assigned_member: members.find(m => m.tbl_users.id === task.assigned_to)?.tbl_users.full_name || 'Unassigned',
                      deadline: task.deadline || null,
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
                showAssignedMember={true}
                deadline={deadline}
              />
              {showEditModal && (
                  <EditTaskModal
                    editingTaskId={editingTaskId}
                    todos={tasks.map((task) => ({
                      ...task,
                      content: task.content || task.description || '',
                      deadline: task.deadline || null,
                    }))}
                    editedContent={editedContent}
                    editedTitle={editedTitle}
                    setEditedContent={setEditedContent}
                    setEditedTitle={setEditedTitle}
                    handleSaveEdit={handleSaveEdit}
                    setShowDeleteModal={setShowDeleteModal}
                    setTodoToDelete={setTodoToDelete}
                    cancelEditing={cancelEditing}
                    assignedTo={assignedTo}
                    setAssignedTo={setAssignedTo}
                    members={members}
                    editedDeadline={editedDeadline}
                    setEditedDeadline={setEditedDeadline}
                  />
              )}
              {/* Delete Confirmation Modal */}
              <DeleteConfirmationModal
                showDeleteModal={showDeleteModal}
                handleDelete={handleDelete}
                setShowDeleteModal={setShowDeleteModal}
              />
              {/* Space Info Modal */}
              <SpaceInfoModal
                isOpen={showSpaceInfoModal}
                onClose={closeSpaceInfoModal}
                members={members}
                spaceCode={spaceCode}
                spaceName={spaceName}
                isLoading={isLoadingMembers}
                error={membersError}
                onLeaveSpace={handleLeaveSpace}
                leaving={leaving}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpacePage;
