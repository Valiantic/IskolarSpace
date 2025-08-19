import React, { useCallback, useState} from 'react'
import { SpaceData, UseCreateSpaceReturn} from '../../types/join-space';

const useCreateSpaceModal = (onSpaceCreated?: (data: SpaceData) => void): UseCreateSpaceReturn => {
  const [spaceName, setSpaceName] = useState('');
  const [spaceCode, setSpaceCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRandomCode = useCallback((): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }, []);

  const generateCode = useCallback(() => {
    setIsGenerating(true);
    // Simulate API call delay
    setTimeout(() => {
      setSpaceCode(generateRandomCode());
      setIsGenerating(false);
    }, 800);
  }, [generateRandomCode]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    if (!spaceCode) {
      generateCode();
    }
  }, [spaceCode, generateCode]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const createSpace = useCallback(() => {
    if (spaceName.trim() && spaceCode.trim()) {
      const spaceData = {
        name: spaceName.trim(),
        code: spaceCode.trim()
      };
      onSpaceCreated?.(spaceData);
      closeModal();
      resetForm();
    }
  }, [spaceName, spaceCode, onSpaceCreated, closeModal]);

  const resetForm = useCallback(() => {
    setSpaceName('');
    setSpaceCode('');
  }, []);

  const handleSpaceCodeChange = (code: string) => {
    setSpaceCode(code);
  };

  return {
    spaceName,
    spaceCode,
    isOpen: isModalOpen,
    isGenerating,
    openModal,
    closeModal,
    handleSpaceNameChange: setSpaceName,
    handleSpaceCodeChange,
    handleGenerateCode: generateCode,
    onCreateSpace: createSpace,
    loading,
    error,
    setLoading,
    setError,
  };
};

export default useCreateSpaceModal;
