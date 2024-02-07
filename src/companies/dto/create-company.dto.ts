import { z } from 'zod';

export const CreateCompanyDto = z.object({
  name: z
    .string()
    .min(4, 'Minimum 4 characters')
    .max(45, 'Maximum 45 characters'),
});

export type CreateCompanyDto = z.infer<typeof CreateCompanyDto>;
