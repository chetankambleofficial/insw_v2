import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataLossWarning from './DataLossWarning';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [showDataLossWarning, setShowDataLossWarning] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);
  const [isProtected, setIsProtected] = useState(false);
  const navigate = useNavigate();

  const protectedNavigate = (path) => {
    if (isProtected) {
      setShowDataLossWarning(true);
      setPendingPath(path);
    } else {
      navigate(path);
    }
  };

  const setNavigationProtection = (isProtected) => {
    setIsProtected(isProtected);
  };

  const handleStayHere = () => {
    setShowDataLossWarning(false);
    setPendingPath(null);
  };

  const handleLeaveAnyway = () => {
    setShowDataLossWarning(false);
    if (pendingPath) {
      setIsProtected(false); // Temporarily disable protection
      navigate(pendingPath);
      setPendingPath(null);
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        protectedNavigate,
        setNavigationProtection,
        isProtected,
      }}
    >
      {children}
      <DataLossWarning
        open={showDataLossWarning}
        onStayHere={handleStayHere}
        onLeaveAnyway={handleLeaveAnyway}
        message="Don't close this window or navigate to another page. You may lose the data you have entered."
      />
    </NavigationContext.Provider>
  );
};