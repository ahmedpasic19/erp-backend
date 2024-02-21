import { z } from 'zod';

export const UpdateCompanyDto = z.object({
  id: z.coerce.number().min(1, 'Must provide companyId'),
  name: z
    .string()
    .min(4, 'Minimum 4 characters')
    .max(45, 'Maximum 45 characters'),
});

export type UpdateCompanyDto = z.infer<typeof UpdateCompanyDto>;
