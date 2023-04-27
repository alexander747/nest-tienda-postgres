import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
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
      imports: [ConfigModule],
      inject: [ConfigService],
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
    TypeOrmModule //para que la entidad de user pueda ser usado desde otro modulo   
  ]
})
export class AuthModule { }