import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`🚀 Cliente conectado: ${client.id}`);
  }

  sendNotification(userId: string, message: string, data?: any) {
    this.server.emit('notification', { message, data });
  }
}
