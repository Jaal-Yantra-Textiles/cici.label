"use client";

import React, { createContext, useContext, ReactNode, useState } from 'react';

type ApiStatusContextType = {
  apiStatus: boolean | null;
  setApiStatus: React.Dispatch<React.SetStateAction<boolean | null>>;
};

const ApiStatusContext = createContext<ApiStatusContextType | undefined>(undefined);

type ApiStatusProviderProps = {
  children: ReactNode;
};

export const ApiStatusProvider: React.FC<ApiStatusProviderProps> = ({ children }) => {
  const [apiStatus, setApiStatus] = useState<boolean | null>(null);

  return (
    <ApiStatusContext.Provider value={{ apiStatus, setApiStatus }}>
      {children}
    </ApiStatusContext.Provider>
  );
};

export const useApiStatus = (): ApiStatusContextType => {
  const context = useContext(ApiStatusContext);
  if (context === undefined) {
    throw new Error('useApiStatus must be used within an ApiStatusProvider');
  }
  return context;
};
