'use client';

import { createContext, useContext, useState, ReactNode } from "react";

/**
 * Interface defining the shape of the ChatContext
 * 
 * @interface ChatContextType
 * @property {string} roomId - The current room ID
 * @property {string} currentUser - The current user's identifier
 * @property {boolean} connected - Connection status
 * @property {(id: string) => void} setRoomId - Function to set room ID
 * @property {(user: string) => void} setCurrentUser - Function to set current user
 * @property {(status: boolean) => void} setConnected - Function to set connection status
 */
interface ChatContextType {
  roomId: string;
  currentUser: string;
  connected: boolean;
  setRoomId: (id: string) => void;
  setCurrentUser: (user: string) => void;
  setConnected: (status: boolean) => void;
}

/**
 * ChatContext
 * 
 * @constant
 * @description
 * React context for managing chat-related state across components
 */
const ChatContext = createContext<ChatContextType | null>(null);

/**
 * ChatProvider Component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 * 
 * @description
 * Provides chat-related state to all child components via Context API
 */
export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [roomId, setRoomId] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);

  return (
    <ChatContext.Provider
      value={{
        roomId,
        currentUser,
        connected,
        setRoomId,
        setCurrentUser,
        setConnected,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

/**
 * Custom hook for accessing chat context
 * 
 * @function
 * @returns {ChatContextType} The chat context value
 * @throws {Error} If used outside of ChatProvider
 * 
 * @description
 * Provides safe access to the chat context with proper type checking
 */
const useChatContext = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export default useChatContext;