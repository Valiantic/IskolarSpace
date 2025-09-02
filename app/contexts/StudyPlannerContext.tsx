'use client';

import React, { createContext, useContext, useState } from 'react';

interface StudyPlannerContextType {
  aiPlan: string;
  setAiPlan: (plan: string) => void;
  selectedType: 'day' | 'week' | 'month' | null;
  setSelectedType: (type: 'day' | 'week' | 'month' | null) => void;
  planTitle: string;
  setPlanTitle: (title: string) => void;
}

const StudyPlannerContext = createContext<StudyPlannerContextType | undefined>(undefined);

export const StudyPlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aiPlan, setAiPlan] = useState('');
  const [selectedType, setSelectedType] = useState<'day' | 'week' | 'month' | null>(null);
  const [planTitle, setPlanTitle] = useState('');

  return (
    <StudyPlannerContext.Provider
      value={{
        aiPlan,
        setAiPlan,
        selectedType,
        setSelectedType,
        planTitle,
        setPlanTitle,
      }}
    >
      {children}
    </StudyPlannerContext.Provider>
  );
};

export const useStudyPlannerContext = () => {
  const context = useContext(StudyPlannerContext);
  if (context === undefined) {
    throw new Error('useStudyPlannerContext must be used within a StudyPlannerProvider');
  }
  return context;
};
