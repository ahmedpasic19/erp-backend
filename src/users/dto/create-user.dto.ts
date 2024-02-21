import { z } from 'zod';

export const CreateUserDto = z.object({
  name: z
    .string()
    .min(4, 'Minimum 4 characters')
    .max(45, 'Maximum 45 characters'),
  password: z
    .string()
    .min(8, 'Minimum 8 characters')
    .max(45, 'Maximum 45 characters'),
  email: z.string().email('Not valid email format'),
  companies: z
    .array(
      z.object({
        company_id: z.coerce.number().min(1, 'Must provide companyId'),
      }),
    )
    .nullish(),
});

export type CreateUserDto = z.infer<typeof CreateUserDto>;
