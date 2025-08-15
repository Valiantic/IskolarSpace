 
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
 }