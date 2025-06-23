// hooks/useAdminSocket.ts
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../service/apiPath';


export const useAdminSocket = (onUpdate: (data: any) => void) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(API_URL, {
      withCredentials: true, 
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🟢 Admin connected to Socket:', socket.id);

      // Tham gia phòng dành cho admin
      socket.emit('authenticate-admin', { role: 'admin' });
    });

    socket.on('admin:update', (data) => {
      console.log('📡 Nhận admin update:', data);
      onUpdate(data); // Callback để xử lý update từ socket
    });

    socket.on('disconnect', () => {
      console.log('🔌 Admin disconnected from socket');
    });

    return () => {
      socket.disconnect();
    };
  }, [onUpdate]);

  return socketRef;
};
