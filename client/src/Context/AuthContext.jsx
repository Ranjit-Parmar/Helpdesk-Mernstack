import { createContext, useState } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AuthContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
