import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    //es un provider la verificacion del jwt y tambien lo exportamos para poder acceder desde otro lado
    JwtStrategy
  ],
  imports: [
    ConfigModule, // para poder tener aceso a las variables de entorno 
    TypeOrmModule.forFeature([User]),//para tabla de la base de datos

    //para usar jwt como estrategia de verificacion de login 
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),

    //El problema aqui es que puede ser que la variable no este cargada aun cuando se lance el app para eso mejor tiene que ser async
    /*
    JwtModule.register({
      //llave secreta para firmar token
      secret: process.env.JWT_SECRET,
      //opciones para token, expira en 2 horas
      signOptions: {
        expiresIn: '2h'
      }
    })
    */

    /**
     * jwt aysncrono
     */

    JwtModule.registerAsync({
      imports: [ConfigModule], // configModule es module que tiene las diferentes configuraciones como json, variables de entorno, este esta inyectado en el modulo principal
      inject: [ConfigService], // ConfigService centralizo en un archivo las variables de entorno o puedo tener acceso a ellas
      //inyecto las variables de entorno y las obtengo con el get
      useFactory: (configService: ConfigService) => {
        return {
          //llave secreta para firmar token
          secret: configService.get('JWT_SECRET'),
          //opciones para token, expira en 2 horas
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    })

  ],
  exports: [
    //para que la entidad de user pueda ser usado desde otro modulo   
    TypeOrmModule,
    //exportamos el jwtStrategy para poder verificar desde otra lado
    JwtStrategy,
    PassportModule,
    JwtModule

  ]
})
export class AuthModule { }
