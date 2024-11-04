import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const email = localStorage.getItem("email");

  
  
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, email}}>
      {children}
    </UserContext.Provider>
  );
};
