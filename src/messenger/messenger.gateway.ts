import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessengerService } from './messenger.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessengerGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messengerService: MessengerService,
    private readonly jwtService: JwtService,
  ) {}
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messengerService.regiserClient(client, payload.id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit(
      'clients-updated',
      this.messengerService.getConnectedClients(),
    );
  }
  handleDisconnect(client: Socket) {
    this.messengerService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.messengerService.getConnectedClients(),
    );
  }

  @SubscribeMessage('client-message')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    //Solo emite al cliente que mandó el mensaje, no a todos
    // client.emit('server-message', {
    //   fullName: 'Yo',
    //   message: payload.message,
    // });

    //Emitir a todos menos al cliente
    // client.broadcast.emit('server-message', {
    //   fullName: 'Yo',
    //   message: payload.message,
    // });

    //Emitir a todos
    this.wss.emit('server-message', {
      fullName: this.messengerService.getUserFullName(client.id),
      message: payload.message,
    });
  }
}
