import { z } from 'zod';

export const UpdateUserDto = z.object({
  id: z.coerce.number().min(1, 'Must provide userId'),
  name: z
    .string()
    .min(4, 'Minimum 4 characters')
    .max(45, 'Maximum 45 characters'),
  password: z
    .string()
    .min(8, 'Minimum 8 characters')
    .max(45, 'Maximum 45 characters'),
  email: z.string().email('Not valid email format'),
  companies_id: z.coerce.number().min(1, 'Must provide companyId'),
});

export type UpdateUserDto = z.infer<typeof UpdateUserDto>;
