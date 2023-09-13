import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { RawHeaders, getUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginService(loginUserDto);
  }


  @Get('private')
  @UseGuards(AuthGuard()) //para verificar el token usamos el useGuards y le mandamos el funcion authGuard 
  testingPrivateRoute(
    // @Req() request: Express.Request //para poder tener la request 
    // @getUser(['role', 'fullName']) user: User, //decorador personalizado, para mandar varios armentos se envia en un arreglo
    @getUser() user: User, //decorador personalizado, para mandar varios armentos se envia en un arreglo
    @getUser('email') userEmail: string, //decorador personalizado, para mandar varios armentos se envia en un arreglo
    @RawHeaders() rawHeaders: string[], // decorador para extraer los headers
    @Headers() headers: IncomingHttpHeaders // otra forma de extraer los headers ya incluido en nest
  ) {

    // console.log(request.user)
    // console.log(user)


    return {
      ok: true,
      message: 'Hello world',
      user,
      userEmail,
      rawHeaders,
      headers
    }
  }


  @Get('private2')
  @SetMetadata('roles', ['admin', 'super-user']) //sirve para añadir informaicon extra al metodo o controlador que se va a ejcutar
  @UseGuards(AuthGuard(), UserRoleGuard) // nuestro guard personalizado no lo ejecutamos
  privateRoute2(

    @getUser() user: User
  ) {
    return {
      user
    }
  }

}
