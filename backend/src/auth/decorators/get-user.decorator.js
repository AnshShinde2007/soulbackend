import { createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator(
    (_data, ctx) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
