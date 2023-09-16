import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: ValidRoles[]) => {
    console.log({ args })
    return SetMetadata(META_ROLES, args)
};
