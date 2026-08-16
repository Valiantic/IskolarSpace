 
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
  tbl_users?: Array<{ full_name?: string; id?: string }> | { full_name?: string; id?: string };
  role: 'admin' | 'member';
}

export interface SpaceInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  spaceCode: string;
  isLoading: boolean;
  error?: string | null;
  spaceName?: string;
  onLeaveSpace?: () => void;
  leaving?: boolean;
  currentUserId?: string;
  onOpenSettings?: () => void;
}

export interface JoinSpaceProps {
  userId: number;
}
export interface AddTaskModalProps {
  showInput: boolean;
  title: string;
  task: string;
  priority: 'low' | 'moderate' | 'high';
  deadline: Date | null;
  setTitle: (title: string) => void;
  setTask: (task: string) => void;
  setPriority: (priority: 'low' | 'moderate' | 'high') => void;
  handleAddTask: (e?: React.FormEvent<any>, assigneesArg?: string[]) => void;
  setShowInput: (show: boolean) => void;
  members?: Member[];
  /** User ids assigned to the task being composed. */
  assignees?: string[];
  setAssignees?: (ids: string[]) => void;
  setDeadline: (date: Date | null) => void;
}

/** Normalizes Member.tbl_users, which the API returns as either an object or a
 *  single-element array depending on the join. */
export const memberUser = (
  member: Member
): { id?: string; full_name?: string } | undefined =>
  Array.isArray(member.tbl_users) ? member.tbl_users[0] : member.tbl_users;