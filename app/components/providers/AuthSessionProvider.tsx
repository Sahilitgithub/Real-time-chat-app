'use client';
import React from 'react'
import { SessionProvider } from 'next-auth/react';

interface AuthSessionProviderProps {
    children: React.ReactNode;
}

const AuthSessionProvider: React.FC<AuthSessionProviderProps> = ({ children }) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

export default AuthSessionProvider
