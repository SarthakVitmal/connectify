// app/api/chat/socket/route.ts
import { Server as ServerIO } from 'socket.io';
import { NextResponse } from 'next/server';

let io: ServerIO;

if (!global.io) {
  io = new ServerIO({
    path: '/api/chat/socket',
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
  });

  global.io = io;

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Emit current count to the newly connected client
    const currentCount = io.engine.clientsCount;
    io.emit('updateOnlineUsers', currentCount);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      io.emit('updateOnlineUsers', io.engine.clientsCount);
    });
  });
}

export async function GET() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST',
    },
  });
}

// Add this to handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Declare global type
declare global {
  var io: ServerIO;
}