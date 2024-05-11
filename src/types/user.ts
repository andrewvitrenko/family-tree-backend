import { User } from '@prisma/client';

export type SecureUser = Omit<User, 'password'>;
