import { Controller } from '@nestjs/common';

import { UseJwtGuard } from '@/guards/jwt.guard';

@UseJwtGuard()
@Controller('user')
export class UserController {}
