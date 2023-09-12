

## Commands
-- Genera un modulo completo

```bash
nest g res auth --no-spec
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

y para que se pueda usar en otros servicios se debe exportar  
  exports: [
    //para que la entidad de user pueda ser usado desde otro modulo   
    TypeOrmModule,
  ]


