import { z } from 'zod';

export const UpdateOfferArticleDto = z.object({
  id: z.coerce.number().min(1, 'Must provide offerArticleId'),
  name: z.string().min(1, 'Must provide article name'),
  code: z.string().min(1, 'Must provide article code'),
  base_price: z.coerce.number().min(0.01, 'Must contain value'),
  base_price_with_vat: z.coerce.number().min(0.01, 'Must contain value'),
  amount: z.coerce.number().min(1, 'Must be at least 1'),
  vat: z.coerce.number().min(1, 'Must contain value'),
  discount: z.coerce.number().min(0, "Can't be lower then 0"),
  articles_id: z.coerce.number().min(1, 'Must provice articleId'),
  offers_id: z.coerce.number().min(1, 'Must provide offerId'),
});

export type UpdateOfferArticleDto = z.infer<typeof UpdateOfferArticleDto>;
