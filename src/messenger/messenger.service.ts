import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
  };
}

@Injectable()
export class MessengerService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  private connectedClients: ConnectedClients = {};

  async regiserClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) throw new Error('User not found');
    if (!user.isActive) throw new UnauthorizedException('User not active');

    this.checkUserConection(userId);

    this.connectedClients[client.id] = {
      socket: client,
      user: user,
    };
  }

  private checkUserConection(userId: string) {
    const user = Object.values(this.connectedClients).find(
      (user) => user.user.id === userId,
    );
    if (user) user.socket.disconnect();
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients);
  }

  getUserFullName(socketId: string) {
    return this.connectedClients[socketId].user.fullName;
  }
}
