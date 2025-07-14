import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';

export const useSocket = () => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      socketRef.current = io('http://localhost:5000', {
        withCredentials: true,
      });

      const socket = socketRef.current;

      socket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
        socket.emit('user-online', user.id);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

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

      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [user]);

  const joinRoom = (roomId) => {
    if (socketRef.current) {
      socketRef.current.emit('join-room', roomId);
    }
  };

  const sendMessage = (roomId, message) => {
    if (socketRef.current) {
      socketRef.current.emit('send-message', {
        roomId,
        message,
        sender: user.id,
        timestamp: new Date(),
      });
    }
  };

  const initiateVideoCall = (targetUserId, sessionId) => {
    if (socketRef.current) {
      socketRef.current.emit('video-call-request', {
        targetUserId,
        callerId: user.id,
        sessionId,
        callerName: user.name,
      });
    }
  };

  const respondToCall = (callerId, accepted, sessionId) => {
    if (socketRef.current) {
      socketRef.current.emit('call-response', {
        callerId,
        accepted,
        sessionId,
        responderId: user.id,
      });
    }
  };

  const onMessage = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('receive-message', callback);
    }
  };

  const onIncomingCall = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('incoming-call', callback);
    }
  };

  const onCallResponse = (callback) => {
    if (socketRef.current) {
      socketRef.current.on('call-response', callback);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    onlineUsers,
    joinRoom,
    sendMessage,
    initiateVideoCall,
    respondToCall,
    onMessage,
    onIncomingCall,
    onCallResponse,
  };
};