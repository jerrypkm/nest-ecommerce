import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser, RoleProtected, Auth } from './decorators';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUser: LoginUserDto) {
    return this.authService.login(loginUser);
  }

  @Get('refresh-token')
  @Auth()
  checkAuthStatus(@GetUser('id') id: string) {
    return this.authService.checkAuthStatus(id);
  }

  //Solo valida que tenga JWT
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    // Custom decorator para obtener el usuario y asegurar que existe
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    //Obtener Headers con custom decorator
    // @RawHeaders() headers: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: 'Hola mundo private',
      user,
      userEmail,
      headers,
    };
  }

  //Valida JWT y roles
  // @SetMetadata('roles', ['admin', 'superuser'])
  //Generar custom decorator para simplificar la logica
  @Get('private2')
  @UseGuards(AuthGuard(), UserRoleGuard)
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin, ValidRoles.user)
  testingPrivateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Hola mundo private',
      user,
    };
  }

  //Simplifica decoradortes y valida JWT y roles
  @Get('private3')
  @Auth(ValidRoles.superUser)
  testingPrivateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      message: 'Hola mundo private',
      user,
    };
  }
}
