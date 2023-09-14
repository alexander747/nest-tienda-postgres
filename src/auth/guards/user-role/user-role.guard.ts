import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {

  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('UserRoleGuard')
    const validRoles: string[] = this.reflector.get('roles', context.getHandler()); // Roles agregados desde el metadata @SetMetadata('roles', ['admin', 'super-user'])
    console.log({ validRoles })

    //obtenemos el usuario del context 
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    if (!user) {
      throw new BadRequestException('User not found.')
    }

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true
      }
    }

    console.log({ rolesUser: user.roles })

    throw new ForbiddenException(`User ${user.fullName} need a valid role :[${validRoles}]`)
  }
}



@Injectable()
export class UserRoleGuard2 implements CanActivate {

  constructor(private readonly reflector: Reflector) {

  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('UserRoleGuard')
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler()); // Roles agregados desde el decorador RoleProtected
    console.log({ validRoles })

    //obtenemos el usuario del context 
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    if (!user) {
      throw new BadRequestException('User not found.')
    }

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true
      }
    }

    console.log({ rolesUser: user.roles })

    throw new ForbiddenException(`User ${user.fullName} need a valid role :[${validRoles}]`)
  }
}



@Injectable()
export class UserRoleGuard3 implements CanActivate {

  constructor(private readonly reflector: Reflector) {

  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('UserRoleGuard')
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler()); // Roles agregados desde el decorador RoleProtected
    console.log({ validRoles })

    //obtenemos el usuario del context 
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    if (!user) {
      throw new BadRequestException('User not found.')
    }

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true
      }
    }

    console.log({ rolesUser: user.roles })

    throw new ForbiddenException(`User ${user.fullName} need a valid role :[${validRoles}]`)
  }
}
