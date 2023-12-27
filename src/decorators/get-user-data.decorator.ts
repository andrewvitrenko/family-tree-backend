import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserData = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    if (!data) return req.user;

    return req.user[data];
  },
);
