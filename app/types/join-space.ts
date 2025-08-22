 
 export interface SpaceData {
    name: string;
    code: string;
 }

export interface UseCreateSpaceReturn {
   spaceName: string;
   spaceCode: string;
   isOpen: boolean;
   isGenerating: boolean;
   openModal: () => void;
   closeModal: () => void;
   handleSpaceNameChange: (name: string) => void;
   handleSpaceCodeChange: (code: string) => void;
   handleGenerateCode: () => void;
   onCreateSpace: () => void;
   loading: boolean;
   error: string | null;
   setLoading: (loading: boolean) => void;
   setError: (error: string) => void;
}

 export interface CreateSpaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateSpace: (data: SpaceData) => void;
    spaceName: string;
    spaceCode: string;
    isGenerating: boolean;
    onSpaceNameChange: (name: string) => void;
    onSpaceCodeChange: (code: string) => void;
    onGenerateCode: () => void;
    userId: number;
 }

export interface  Member {
  user_id: string;
  tbl_users?: Array<{ full_name?: string }> | { full_name?: string };
  role: 'admin' | 'member';
}

export interface SpaceInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  spaceCode: string;
  isLoading: boolean;
  error?: string | null;
}

export interface JoinSpaceProps {
  userId: number;
}
export interface AddTaskModalProps {
  showInput: boolean;
  title: string;
  task: string;
  priority: 'low' | 'moderate' | 'high';
  setTitle: (title: string) => void;
  setTask: (task: string) => void;
  setPriority: (priority: 'low' | 'moderate' | 'high') => void;
  handleAddTask: (e?: React.FormEvent<any>, assignedToArg?: string | null) => void;
  setShowInput: (show: boolean) => void;
  members?: Member[];
  assignedTo?: string | null;
  setAssignedTo?: (id: string | null) => void;
}