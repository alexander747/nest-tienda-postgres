import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { RawHeaders, getUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard, UserRoleGuard2, UserRoleGuard3 } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { AuthDecoratorCentralizado } from './decorators/auth.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth') // para categorizar las partes en la documentacion del swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'Logged' })
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
  @SetMetadata('roles', ['admin', 'super-user']) //sirve para añadir informaicon extra al metodo o controlador que se va a ejcutar y lo podemos obtener desde un guard desde el this.reflector.get('roles', context.getHandler());
  @UseGuards(AuthGuard(), UserRoleGuard) // nuestro guard personalizado no lo ejecutamos
  privateRoute2(

    @getUser() user: User
  ) {
    return {
      user
    }
  }


  /**
   * En esta ruta ya eliminamos la agregacion de los roles por metadata y mejora usamos un customDecorator creado por nosotros
   */
  @Get('private3')
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard2) // nuestro guard personalizado no lo ejecutamos
  privateRoute3(
    @getUser() user: User
  ) {
    return {
      user
    }
  }

  /**
 * En esta ruta ya eliminamos varios guards y hacemos solo uno para que haga todo
 * https://docs.nestjs.com/custom-decorators#decorator-composition
 */
  @Get('private4')
  @AuthDecoratorCentralizado()
  privateRoute4(
    @getUser() user: User
  ) {
    return {
      user
    }
  }

  @Get('check-auth-status')
  @AuthDecoratorCentralizado()
  checkAuthStatus(
    @getUser() user: User
  ) {
    return this.authService.checkAuthStatus(user)
  }

}
