import { io } from "socket.io-client";

export const socketio = io(process.env.NEXT_PUBLIC_SOCKET ?? "http://localhost:5000"); 