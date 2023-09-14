

## Commands
-- Genera un modulo completo

```bash
nest g res auth --no-spec
```

-- Genera un guard se le puede pasar la ruta en donde queremos crear el archivo

```bash
nest g res gu auth/guards/userRole --no-spec
```

-- Genera un decorador se le puede pasar la ruta en donde queremos crear el archivo

```bash
nest g d auth/decorators/roleProtected --no-spec
```

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Documentación 


- importar y exportar entidades  
para que una entidad pueda ser usada debe estar importada en el module.ts del paquete que la creo
TypeOrmModule.forFeature([User]),//para tabla de la base de datos

- para que se pueda usar en otros servicios se debe exportar  
  exports: [
    //para que la entidad de user pueda ser usado desde otro modulo   
    TypeOrmModule,
  ]

- Para que una entidad pueda ser usada en un servicio debe inyectarse en el constructor  
  constructor(
    @InjectRepository(User) //User es la entidad, y el injectRepository viene de typeorm
    private readonly userRepository: Repository<User>,

    //para el jwt
    private readonly jwtService: JwtService,
  ) { }

- Decorador es una funcion que se hace a partir de createParamDecorator y que devuelve un callback ese collback tiene como primer argumento la data que le pasamos desde la ruta donde la invocamos y como segundo parametro es ctx: ExecutionContext que es el contexto en el que se esta ejecutando en ese momento nest ahí tenemos acceso a la request

- Para que un Guard sea valido tiene que implementar el metodo CanActivate el cual regresa un valor booleano, true lo deja pasar, falso no lo deja pasar, al llamar el guard en la ruta no lo ejecutamos, si el guard devuelve false entonces nunca entra al recurso y da error 403 no autorizado.

