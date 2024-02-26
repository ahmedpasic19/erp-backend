import { z } from 'zod';

export const CreateOfferDto = z.object({
  date_of_order: z.string().min(1, 'Must provide date value'),
  delivery_due_date: z.string().min(1, 'Must provide date value'),
  payment_due_date: z.string().min(1, 'Must provide date value'),
  worker_id: z.string().min(1, 'Must provide userId as workerId'),
  client_id: z.string().min(1, 'Must provide userId as clientId'),
  currencies_id: z.coerce.number().min(1, 'Must provide currencyId'),
  companies_id: z.coerce.number().min(1, 'Must provide companyId'),
  vat: z.coerce.number().min(0, "Value can't be bellow 0").max(100, 'Max 100%'),
});

export type CreateOfferDto = z.infer<typeof CreateOfferDto>;
