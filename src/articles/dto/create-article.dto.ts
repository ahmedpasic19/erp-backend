import { z } from 'zod';

export const CreateArticleDto = z.object({
  name: z
    .string()
    .min(4, 'Minimum 4 characters')
    .max(45, 'Maximum 45 characters'),
  code: z
    .string()
    .min(4, 'Minimum 4 characters')
    .max(45, 'Maximum 45 characters'),
  price_without_vat: z.coerce.number().min(0, 'Value cant be negative'),
  price_with_vat: z.coerce.number().min(0, 'Value cant be negative'),
  companies_id: z.coerce.number().min(1, 'Must provide companiesId'),
});

export type CreateArticleDto = z.infer<typeof CreateArticleDto>;
