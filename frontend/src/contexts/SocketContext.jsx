  import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, checkAuth } = useAuth();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;

  // Initialize socket connection
  const initializeSocket = useCallback(() => {
    if (!user) return;

    try {
      socketRef.current = io(`${import.meta.env.VITE_BACKEND_URL}`, {
        withCredentials: true,
        auth: {
          userId: user.id || user._id,
          role: user.role
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000
      });

      const socket = socketRef.current;

      // Connection events
      socket.on('connect', () => {
        console.log('✅ Connected to socket server');
        setIsConnected(true);
        setReconnectAttempts(0);

        // Join user to their room
        socket.emit('join', {
          userId: user.id || user._id,
          role: user.role
        });
      });

      socket.on('disconnect', (reason) => {
        console.log('❌ Disconnected from socket server:', reason);
        setIsConnected(false);

        if (reason === 'io server disconnect') {
          // Server disconnected, try to reconnect
          socket.connect();
        }
      });

      socket.on('connect_error', (error) => {
        console.error('🔴 Socket connection error:', error);
        setIsConnected(false);

        if (reconnectAttempts < maxReconnectAttempts) {
          setReconnectAttempts(prev => prev + 1);
          setTimeout(() => {
            if (socketRef.current) {
              socketRef.current.connect();
            }
          }, 1000 * (reconnectAttempts + 1));
        }
      });

      socket.on('reconnect', (attemptNumber) => {
        console.log('🔄 Reconnected to socket server, attempt:', attemptNumber);
        setIsConnected(true);
        setReconnectAttempts(0);
      });

      socket.on('reconnect_error', (error) => {
        console.error('🔄 Reconnection error:', error);
      });

      // User status updates
      socket.on('user-status-update', ({ userId, status }) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          if (status === 'online') {
            newSet.add(userId);
          } else {
            newSet.delete(userId);
          }
          return newSet;
        });
      });

      // Message events
      socket.on('new-message', (message) => {
        console.log('💬 New message received:', message);
        // Emit custom event for components to listen to
        window.dispatchEvent(new CustomEvent('new-message', { detail: message }));
      });

      // Call events
      socket.on('incoming-call', (callData) => {
        console.log('📞 Incoming call:', callData);
        window.dispatchEvent(new CustomEvent('incoming-call', { detail: callData }));
      });

      socket.on('call-response', (response) => {
        console.log('📞 Call response:', response);
        window.dispatchEvent(new CustomEvent('call-response', { detail: response }));
      });

      // Session events
      socket.on('session-update', (sessionData) => {
        console.log('🔄 Session update:', sessionData);
        window.dispatchEvent(new CustomEvent('session-update', { detail: sessionData }));
      });

      // Typing events
      socket.on('user-typing', ({ userId, roomId, isTyping }) => {
        window.dispatchEvent(new CustomEvent('user-typing', {
          detail: { userId, roomId, isTyping }
        }));
      });

      // Error handling
      socket.on('error', (error) => {
        console.error('🔴 Socket error:', error);
      });

    } catch (error) {
      console.error('Failed to initialize socket:', error);
    }
  }, [user, reconnectAttempts]);

  // Initialize socket when user changes
  useEffect(() => {
    if (user) {
      initializeSocket();
    } else {
      // Clean up socket when user logs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
        setOnlineUsers(new Set());
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, [user, initializeSocket]);

  // Socket utility functions
  const joinRoom = useCallback((roomId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join-room', roomId);
      console.log('🚪 Joined room:', roomId);
    }
  }, [isConnected]);

  const leaveRoom = useCallback((roomId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leave-room', roomId);
      console.log('🚪 Left room:', roomId);
    }
  }, [isConnected]);

  const sendMessage = useCallback((roomId, message, messageType = 'text') => {
    if (socketRef.current && isConnected) {
      const messageData = {
        roomId,
        message,
        messageType,
        timestamp: new Date(),
        senderId: user?.id || user?._id
      };
      socketRef.current.emit('send-message', messageData);
      console.log('💬 Sent message:', messageData);
    }
  }, [isConnected, user]);

  const setTyping = useCallback((roomId, isTyping) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing', { roomId, isTyping });
    }
  }, [isConnected]);

  const initiateVideoCall = useCallback((targetUserId, roomId) => {
    if (socketRef.current && isConnected) {
      const callData = {
        targetUserId,
        callerId: user?.id || user?._id,
        roomId,
        callerName: user?.name
      };
      socketRef.current.emit('video-call-request', callData);
      console.log('📞 Initiated video call:', callData);
    }
  }, [isConnected, user]);

  const respondToCall = useCallback((callerId, accepted, roomId) => {
    if (socketRef.current && isConnected) {
      const responseData = {
        callerId,
        accepted,
        roomId,
        responderId: user?.id || user?._id
      };
      socketRef.current.emit('call-response', responseData);
      console.log('📞 Call response sent:', responseData);
    }
  }, [isConnected, user]);

  const toggleAvailability = useCallback((isAvailable) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('toggle-availability', { isAvailable });
      console.log('🔄 Toggled availability:', isAvailable);
    }
  }, [isConnected]);

  const requestMentor = useCallback((mentorId, sessionType, topic) => {
    if (socketRef.current && isConnected) {
      const requestData = {
        mentorId,
        studentId: user?.id || user?._id,
        sessionType,
        topic
      };
      socketRef.current.emit('request-mentor', requestData);
      console.log('🤝 Mentor request sent:', requestData);
    }
  }, [isConnected, user]);

  const acceptSession = useCallback((sessionId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('accept-session', { sessionId });
      console.log('✅ Session accepted:', sessionId);
    }
  }, [isConnected]);

  const declineSession = useCallback((sessionId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('decline-session', { sessionId });
      console.log('❌ Session declined:', sessionId);
    }
  }, [isConnected]);

  const endSession = useCallback((sessionId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('end-session', { sessionId });
      console.log('🔚 Session ended:', sessionId);
    }
  }, [isConnected]);

  const value = {
    socket: socketRef.current,
    isConnected,
    onlineUsers,
    joinRoom,
    leaveRoom,
    sendMessage,
    setTyping,
    initiateVideoCall,
    respondToCall,
    toggleAvailability,
    requestMentor,
    acceptSession,
    declineSession,
    endSession
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
