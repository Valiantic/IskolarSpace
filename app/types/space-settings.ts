export interface SpaceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaceId: string;
  spaceName: string;
  members: Member[];
  currentUserId: string;
  onSpaceUpdated: () => void;
  onSpaceDeleted: () => void;
}

export interface Member {
  user_id: string;
  role: string;
  tbl_users: {
    id: string;
    full_name: string;
  };
}

export interface SpaceSettingsHookProps {
  spaceId: string;
  spaceName: string;
  members: Member[];
  currentUserId: string;
  onSpaceUpdated: () => void;
  onSpaceDeleted: () => void;
}

export interface UpdateSpaceNameData {
  spaceId: string;
  newName: string;
}

export interface DeleteSpaceData {
  spaceId: string;
}

export interface UpdateMemberRoleData {
  spaceId: string;
  userId: string;
  role: 'admin' | 'member';
}

export interface KickMemberData {
  spaceId: string;
  userId: string;
}
