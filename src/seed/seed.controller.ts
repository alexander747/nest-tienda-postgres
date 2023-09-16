import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AuthDecoratorCentralizado } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { ApiTags } from '@nestjs/swagger';



@ApiTags('Seed') // para categorizar las partes en la documentacion del swagger
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) { }



  @Get()
  /**
   * para poder usarse aqui el AuthDecoratorCentralizado tuvimos que importar el modulo de auth y en el auth exportar el JwtStrategy ya que este hacia uso en la verificación del jwt ya que es un modulo y todos los modulos estan encapsulados
   */
  @AuthDecoratorCentralizado(ValidRoles.user)
  executeSeed() {
    return this.seedService.runSeed();
  }

}
