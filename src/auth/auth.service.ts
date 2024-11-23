import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PostgresExceptionHandler } from 'src/common/exceptions/postgres-handler.exception';
import { CryptAdapter } from 'src/common/adapters';
import { JwtPayload } from './interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly postgresExceptionHandler: PostgresExceptionHandler,
    private readonly cryptAdapter: CryptAdapter,

    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: this.cryptAdapter.hashSync(password, 10),
      });
      await this.userRepository.save(user);

      return {
        ...userData,
        token: this.getJwt({ id: user.id }),
      };
    } catch (error) {
      this.postgresExceptionHandler.handlerDBExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    //Se busca directamente user y password porque password tiene select false
    const user = await this.userRepository.findOne({
      where: { email: email.toLocaleLowerCase() },
      select: { email: true, password: true, id: true },
    });

    if (!user) throw new UnauthorizedException('Correo no encontrado');

    if (!this.cryptAdapter.compareSync(password, user.password))
      throw new UnauthorizedException('La contraseña es incorrecta');

    return {
      email,
      token: this.getJwt({ id: user.id }),
    };
  }

  async checkAuthStatus(id: string) {
    return {
      token: this.getJwt({ id: id }),
    };
  }

  private getJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }
}
