import { z } from 'zod';

export const UpdateStorageDto = z.object({
  id: z.coerce.number().min(1, 'Must provide companyId'),
  name: z
    .string()
    .min(4, 'Minimum 4 characters')
    .max(45, 'Maximum 45 characters'),
  companies_id: z.coerce.number().min(1, 'Must provide companyId'),
});

export type UpdateStorageDto = z.infer<typeof UpdateStorageDto>;
