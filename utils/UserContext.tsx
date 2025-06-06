import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredUser } from './api';

type UserRole = 'SHIPMENT_OWNER' | 'TRAVELLER';

interface UserContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('SHIPMENT_OWNER');

  useEffect(() => {
    // Load initial role from stored user data
    const loadUserRole = async () => {
      const user = await getStoredUser();
      if (user?.currentRole) {
        setUserRole(user.currentRole);
      }
    };
    loadUserRole();
  }, []);

  return (
    <UserContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserProvider');
  }
  return context;
} 