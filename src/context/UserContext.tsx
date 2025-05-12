
import React, { createContext, useContext, useState, useEffect } from 'react';

// User tiers
export type UserTier = 'silver' | 'gold' | 'platinum';

interface UserContextType {
  isAuthenticated: boolean;
  userTier: UserTier;
  downloadCount: number;
  login: () => void;
  logout: () => void;
  upgradeTier: (tier: UserTier) => void;
  incrementDownloadCount: () => void;
  resetDownloadCount: () => void;
  canDownload: boolean;
  maxDownloads: number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userTier, setUserTier] = useState<UserTier>('silver');
  const [downloadCount, setDownloadCount] = useState<number>(0);

  const maxDownloads = 5; // Free tier max downloads
  const canDownload = userTier !== 'silver' || downloadCount < maxDownloads;

  // Load user data from localStorage on initial render
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedTier = localStorage.getItem('userTier') as UserTier;
    const storedDownloads = localStorage.getItem('downloadCount');

    if (storedAuth) setIsAuthenticated(storedAuth === 'true');
    if (storedTier && ['silver', 'gold', 'platinum'].includes(storedTier)) setUserTier(storedTier);
    if (storedDownloads) setDownloadCount(parseInt(storedDownloads, 10));
  }, []);

  // Save to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
    localStorage.setItem('userTier', userTier);
    localStorage.setItem('downloadCount', downloadCount.toString());
  }, [isAuthenticated, userTier, downloadCount]);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    // Maintain download count and tier for demo purposes
  };

  const upgradeTier = (tier: UserTier) => {
    setUserTier(tier);
  };

  const incrementDownloadCount = () => {
    if (userTier === 'silver') {
      setDownloadCount(prev => prev + 1);
    }
  };

  const resetDownloadCount = () => {
    setDownloadCount(0);
  };

  return (
    <UserContext.Provider value={{
      isAuthenticated,
      userTier,
      downloadCount,
      login,
      logout,
      upgradeTier,
      incrementDownloadCount,
      resetDownloadCount,
      canDownload,
      maxDownloads
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
