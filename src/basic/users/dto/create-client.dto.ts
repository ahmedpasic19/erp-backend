import { z } from 'zod';
import { CreateUserDto } from './create-user.dto';

export const userType = z.object({ type: z.enum(['USER', 'CLIENT']) });
export const CreateClientDto = CreateUserDto.merge(userType)
  .extend({
    current_company_id: z.coerce
      .number()
      .min(1, 'Must provide current_company_id'),
  })
  .omit({
    password: true,
    companies: true,
  });

export type CreateClientDto = z.infer<typeof CreateClientDto>;
