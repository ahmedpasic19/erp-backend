import { z } from 'zod';

export const SetCurrenctCompanyDto = z.object({
  company_id: z.coerce.number().min(1, 'Must provide companyId'),
  user_id: z.string().min(1, 'Must provide userId'),
});

export type SetCurrenctCompanyDto = z.infer<typeof SetCurrenctCompanyDto>;
