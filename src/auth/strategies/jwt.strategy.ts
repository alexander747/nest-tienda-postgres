import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt.payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

//debe ser inyectable las estrategias y es un provider
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {


    constructor(
        //para hacer uso de las propiedades de la entidad user
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        // para hacer uso de las variables de entorno, tambien hay que importarlo en el modulo el ConfigModule 
        configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),// jwt secret de la variable de entorno 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //de donde voy a extraer el jwt 
        });

    }

    async validate(payload: JwtPayload): Promise<User> {

        const { email } = payload;

        const user = await this.userRepository.findOneBy({ email });

        if (!user) throw new UnauthorizedException('Token invalido')

        if (!user.isActive) throw new UnauthorizedException('Usuario inactivo')

        //README: Todo lo que yo retorne se agrega automaticamente al objeto Request
        return user;
    }
}