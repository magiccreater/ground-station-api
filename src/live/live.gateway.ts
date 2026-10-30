import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

export interface LiveEvent {
  type: 'reservation.created';
  data: unknown;
}

// Every open screen connects to ws://localhost:3000/live and receives booking events
@WebSocketGateway({ path: '/live' })
export class LiveGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: WebSocket) {
    client.send(JSON.stringify({ type: 'hello', data: { clients: this.server.clients.size } }));
  }

  handleDisconnect() {
        console.log('client left, now connected:', this.server.clients.size);
  }

  broadcast(event: LiveEvent) {
    const message = JSON.stringify(event);
    for (const client of this.server.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }
  
}
