// Dashboard Types - Centralized type definitions for all dashboard components

// Core Todo interface used across multiple components
export interface Todo {
  id: string;
  title?: string;
  content: string;
  user_id: string;
  created_at: string;
  priority: 'low' | 'moderate' | 'high';
  assigned_to?: string;
  assigned_member?: string;
  deadline?: string | Date | null;
  tableType?: 'todos' | 'tasks';
}

// Priority type for consistent typing
export type Priority = 'low' | 'moderate' | 'high';

// Header Component Types
export interface HeaderProps {
  isNewUser: boolean;
  userFullName: string | null;
  handleLogout: () => void;
}

// Sidebar Component Types
export type SidebarProps = {
  userFullName: string | null;
  profilePicture?: string | null;
  handleLogout: () => void;
  activePage?: string;
}

// TaskGrid Component Types
export interface TaskGridProps {
  todos: Todo[];
  fetchTodos: () => Promise<void>;
  startEditing: (todo: Todo) => void;
  handlePriorityChange: (todoId: string, newPriority: Priority) => Promise<void>;
  searchTerm?: string;
  priorityFilters?: Priority[];
  totalTasks?: number;
}

// AddTaskModal Component Types
export interface AddTaskModalProps {
  showInput: boolean;
  title: string;
  task: string;
  priority: Priority;
  deadline: Date | null;
  setTitle: (title: string) => void;
  setTask: (task: string) => void;
  setPriority: (priority: Priority) => void;
  setDeadline: (date: Date | null) => void;
  handleAddTask: (e: React.FormEvent<HTMLFormElement>) => void;
  setShowInput: (show: boolean) => void;
}

// EditTaskModal Component Types
export interface EditTaskModalProps {
  editingTaskId: string | null;
  todos: Todo[];
  editedContent: string;
  editedTitle: string;
  editedDeadline: Date | null;
  setEditedContent: (content: string) => void;
  setEditedTitle: (title: string) => void;
  setEditedDeadline: (date: Date | null) => void;
  handleSaveEdit: (todoId: string) => void;
  setShowDeleteModal: (show: boolean) => void;
  setTodoToDelete: (todoId: string | null) => void;
  cancelEditing: () => void;
}

// DeleteConfirmationModal Component Types
export interface DeleteConfirmationModalProps {
  showDeleteModal: boolean;
  handleDelete: () => void;
  setShowDeleteModal: (show: boolean) => void;
}

// SearchBar Component Types
export interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

// PriorityFilter Component Types
export interface PriorityFilterProps {
  onFilterChange: (priorities: Priority[], deadlines?: string[]) => void;
  className?: string;
}

// NoTask Component Types
export interface NoTaskBannerProps {
  searchTerm?: string;
  priorityFilters?: Priority[];
  totalTasks?: number;
}

// SpaceBackground Component Types
export interface Star {
  x: number;
  y: number;
  radius: number;
  velocity: number;
  alpha: number;
  color: string;
}

// Sparkles UI Component Types
export type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

// Priority Configuration Types (for filtering and display)
export interface PriorityConfig {
  value: Priority;
  label: string;
  color: string;
  bgColor: string;
  hoverColor: string;
  icon: React.ReactNode;
}

// Dashboard State Types
export interface DashboardState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  priorityFilters: Priority[];
  editingTaskId: string | null;
  showInput: boolean;
  showDeleteModal: boolean;
  todoToDelete: string | null;
}

// Form Event Types
export type TaskFormEvent = React.FormEvent<HTMLFormElement>;
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type TextareaChangeEvent = React.ChangeEvent<HTMLTextAreaElement>;
export type ButtonClickEvent = React.MouseEvent<HTMLButtonElement>;

// Extend TaskGridProps to include showAssignedMember
export type ExtendedTaskGridProps = TaskGridProps & {
  todos: Todo[];
  showAssignedMember?: boolean;
  deadline: Date | null;  
};

export type StudyPlannerProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  openAddTaskWithAIPlan?: (planTitle: string, planContent: string) => void;
  tableType?: 'todos' | 'tasks';
  spaceId?: string;
};
