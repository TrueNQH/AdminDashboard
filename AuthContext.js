import React, { createContext, useState } from 'react';

// Tạo context
export const AuthContext = createContext();

// Tạo provider để cung cấp context cho toàn bộ app
export const AuthProvider = ({ children }) => {
  const [username, setUserStorage] = useState('');

  return (
    <AuthContext.Provider value={{ username, setUserStorage }}>
      {children}
    </AuthContext.Provider>
  );
};
