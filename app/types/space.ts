
export interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  brightness: number;
}

export interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

// Cosmic Arrow Button Types
export interface CosmicArrowButtonProps {
  href: string;
  label: string;
  className?: string;
  position?: 'bottom-center' | 'bottom-left' | 'bottom-right';
}

// Space Note Types
export interface SpaceNote {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  expires_at: string;
  position: NotePosition;
  user_email?: string;
  user_avatar?: string;
  display_name?: string;
  word?: string;
}

export interface NotePosition {
  x: number;
  y: number;
}

export interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  isLoading: boolean;
}

export interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  onDelete: () => void;
  initialContent: string;
  isLoading: boolean;
}

export interface FloatingNoteBubbleProps {
  note: SpaceNote;
  allNotes: SpaceNote[];
  onEdit: () => void;
  isOwner: boolean;
}
