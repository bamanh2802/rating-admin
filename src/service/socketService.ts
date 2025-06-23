import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from './apiPath'; 

interface AdminAuthPayload {
    role: 'admin';
    // Bạn có thể thêm token ở đây để bảo mật
    // token: string;
}

interface AdminEventPayload {
    onlineCount?: number;
    activity?: object;
    [key:string]: any;
}

type GenericCallback = (...args: any[]) => void;

class AdminSocketService {
    private socket: Socket | null = null;
    private isConnected = false;
    private isAuthenticated = false; // Trạng thái xác thực
    private events: { [key: string]: GenericCallback[] } = {};

    public on(eventName: string, callback: GenericCallback): void {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    public off(eventName: string, callback: GenericCallback): void {
        if (!this.events[eventName]) return;
        this.events[eventName] = this.events[eventName].filter(
            (cb) => cb !== callback
        );
    }

    private emit(eventName: string, ...args: any[]): void {
        if (!this.events[eventName]) {
            return;
        }
        this.events[eventName].forEach((callback) => {
            try {
                callback(...args);
            } catch (error) {
                console.error(`❌ Error in listener for event ${eventName}:`, error);
            }
        });
    }

    public connect(serverUrl: string = SOCKET_URL): void {
        if (this.socket && this.isConnected) {
            console.log('Admin socket is already connected.');
            return;
        }

        if (this.socket) {
            this.disconnect();
        }
        
        console.log('Attempting to connect to the server as admin...');
        this.socket = io(serverUrl, { 
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 10, 
            path: '/api/socket.io'
        });

        this.setupListeners();
    }
    
    private setupListeners(): void {
        if (!this.socket) return;
        
        this.socket.on('connect', () => {
            this.isConnected = true;
            console.log(`✅ Admin socket connected successfully: ${this.socket?.id}`);
            this.emit('connected');
            
            this.authenticate();
        });

        this.socket.on('disconnect', () => {
            this.isConnected = false;
            this.isAuthenticated = false; 
            this.emit('disconnected');
            console.log('🔌 Admin socket disconnected.');
        });
        
        this.socket.on('connect_error', (error: Error) => {
            console.error('❌ Admin socket connection error:', error.message);
        });

        // Lắng nghe các sự kiện dành riêng cho Admin
        this.socket.on('admin:initial-data', (payload: AdminEventPayload) => {
            this.isAuthenticated = true; // Nhận được data nghĩa là đã xác thực thành công
            this.emit('admin:initial-data', payload);
        });
        
        this.socket.on('user:online', (payload: AdminEventPayload) => {
            this.emit('user:online', payload);
        });
        
        this.socket.on('user:offline', (payload: AdminEventPayload) => {
            this.emit('user:offline', payload);
        });
        
        this.socket.on('activity:new', (payload: AdminEventPayload) => {
            this.emit('activity:new', payload);
        });
    }

    private authenticate(): void {
        if (this.socket && this.socket.connected) {
            console.log('Authenticating as admin...');
            this.socket.emit('authenticate-admin', { role: 'admin' } as AdminAuthPayload);
        }
    }

    // --- Hàm ngắt kết nối ---
    public disconnect(): void {
        if (this.socket) {
            this.socket.off(); // Gỡ bỏ tất cả các listeners của socket.io
            this.socket.disconnect();
        }
        this.socket = null;
        this.isConnected = false;
        this.isAuthenticated = false;
        this.events = {}; // Xóa các listeners nội bộ
        console.log('Admin socket has been manually disconnected.');
    }

    public isSocketConnected(): boolean {
        return this.isConnected && this.isAuthenticated;
    }
}

// Xuất một instance duy nhất (singleton pattern)
export const adminSocketService = new AdminSocketService();