import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export const getUser = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        console.log({ data })
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;
        if (!user) {
            throw new InternalServerErrorException("User not found in the request.")
        }
        return !data ? user : user[data];
    }
);


export const RawHeaders = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();
        return req.rawHeaders;
    }
);