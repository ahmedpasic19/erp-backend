import { z } from 'zod';

export const UpdateInvoiceDto = z
  .object({
    id: z.number().min(1, 'Must provide invoiceId'),
    date_of_order: z.string().min(1, 'Must provide date value'),
    delivery_due_date: z.string().min(1, 'Must provide date value'),
    payment_due_date: z.string().min(1, 'Must provide date value'),
    worker_id: z.string().min(1, 'Must provide userId as workerId'),
    client_id: z.string().min(1, 'Must provide userId as clientId'),
    currencies_id: z.coerce.number().min(1, 'Must provide currencyId'),
    companies_id: z.coerce.number().min(1, 'Must provide companyId'),
    invoice_number: z.string().min(1, 'Must provide invoice_number'),
    vat: z.coerce
      .number()
      .min(0, "Value can't be under 0")
      .max(100, 'Max 100%'),
    vat_value: z.number().min(0, "Value can't be bellow 0"),
    total_discount: z.number().min(0, "Value can't be bellow 0"),
    valid: z.boolean(),
  })
  .merge(z.object({ id: z.coerce.number().min(1, 'Must provide invoiceId') }));

export type UpdateInvoiceDto = z.infer<typeof UpdateInvoiceDto>;
