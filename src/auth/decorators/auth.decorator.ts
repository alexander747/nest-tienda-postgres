import { UseGuards, applyDecorators } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles';
import { RoleProtected } from './role-protected/role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard3 } from '../guards/user-role/user-role.guard';

export function AuthDecoratorCentralizado(...roles: ValidRoles[]) {
    const ROLES = roles ? roles : []
    return applyDecorators(
        //aqui los decoradoradores van sin la arroba ojo 
        RoleProtected(...ROLES),
        UseGuards(AuthGuard(), UserRoleGuard3),
    );
}