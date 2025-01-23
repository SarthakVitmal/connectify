// lib/socket-service.ts
import { Server as NetServer } from 'http';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponse } from 'next';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: any;
};

export class SocketService {
  private static io: ServerIO | null = null;

  public static getIO(): ServerIO | null {
    return SocketService.io;
  }

  public static setIO(io: ServerIO): void {
    SocketService.io = io;
  }
}