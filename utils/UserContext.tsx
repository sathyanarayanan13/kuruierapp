import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredUser } from './api';

type UserRole = 'SHIPMENT_OWNER' | 'TRAVELLER';

interface UserContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('SHIPMENT_OWNER');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const user = await getStoredUser();
        if (user?.currentRole) {
          setUserRole(user.currentRole);
        }
      } catch (error) {
        console.error('Error loading user role:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserRole();
  }, []);

  return (
    <UserContext.Provider value={{ userRole, setUserRole, isLoading }}>
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