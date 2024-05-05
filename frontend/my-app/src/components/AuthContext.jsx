import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  const login = (Id) => {
    setUserId(Id);
    setAuthenticated(true);
  };

  const logout = () => {
    setUserId(null);
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ userId, authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// export default {useAuth,AuthProvider};