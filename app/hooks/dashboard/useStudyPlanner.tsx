import React from 'react'


const useStudyPlanner = ({ onClose }: { onClose: () => void }) => {
  const [selectedType, setSelectedType] = React.useState<'day' | 'month' | 'year' | null>(null);

  const handleTypeClick = (type: 'day' | 'month' | 'year') => {
    setSelectedType(type);
  };
  const [content, setContent] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleClose = () => {
    setContent('')
    onClose()
  }
  
  const handleBackdropClick = (e: React.MouseEvent) => {
  if (e.target === e.currentTarget) {
        handleClose()
      }
  }

  return {
    content,
    isLoading,
    setContent,
    setIsLoading,
    handleBackdropClick,
    handleClose
  ,selectedType,
  handleTypeClick
  }
}

export default useStudyPlanner
