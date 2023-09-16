import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt.payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    //para el jwt
    private readonly jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user)

      delete user.password; //elimina de la respuesta la password

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      }

    } catch (error) {
      console.log(error)
      this.handleDbErrors(error)
    }
  }

  async loginService(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    console.log("init login")
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    })

    if (!user) throw new UnauthorizedException('Credenciales incorrectas email.')

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credenciales incorrectas password.')
    }



    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }

  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }


  private handleDbErrors(error: any): never {
    if (error.code == 23505) throw new BadRequestException(error.detail)
    throw new InternalServerErrorException('Verifique sus logs')
  }

}
