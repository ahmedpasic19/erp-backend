import { z } from 'zod';

export const UpdateArticleDto = z.object({
  id: z.coerce.number().min(1, 'Must provice articleId'),
  name: z
    .string()
    .min(4, 'Minimum 4 characters')
    .max(45, 'Maximum 45 characters'),
  code: z
    .string()
    .min(4, 'Minimum 4 characters')
    .max(45, 'Maximum 45 characters'),
  price_without_vat: z.coerce.number(),
  price_with_vat: z.coerce.number(),
  companies_id: z.coerce.number().min(1, 'Must provide companiesId'),
});

export type UpdateArticleDto = z.infer<typeof UpdateArticleDto>;
