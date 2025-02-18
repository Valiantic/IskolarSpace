"use client";
import React, { createContext, useContext, useState } from 'react';

type BackgroundContextType = {
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
};

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [backgroundColor, setBackgroundColor] = useState("000000");

  return (
    <BackgroundContext.Provider value={{ backgroundColor, setBackgroundColor }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}
