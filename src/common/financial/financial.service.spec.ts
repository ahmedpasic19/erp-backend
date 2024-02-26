import { Test, TestingModule } from '@nestjs/testing';
import { FinancialService } from './financial.service';

describe('FinancialService', () => {
  let service: FinancialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinancialService],
    }).compile();

    service = module.get<FinancialService>(FinancialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateTax', () => {
    it('should correctly calculate the tax amount', () => {
      const amount = 100;
      const taxRate = 10;
      const expectedTaxAmount = 10;
      const calculatedTaxAmount = service.calculateTax(amount, taxRate);
      expect(calculatedTaxAmount).toBe(expectedTaxAmount);
    });
  });

  describe('calculateTotalWithTax', () => {
    it('should correctly calculate the total amount with tax', () => {
      const amount = 100;
      const taxRate = 10;
      const expectedTotalAmount = 110;
      const calculatedTotalAmount = service.calculateTotalWithTax(
        amount,
        taxRate,
      );
      expect(calculatedTotalAmount).toBe(expectedTotalAmount);
    });
  });

  describe('applyDiscount', () => {
    it('should correctly apply the discount', () => {
      const amount = 100;
      const discountPercentage = 20;
      const expectedDiscountedAmount = 80;
      const calculatedDiscountedAmount = service.applyDiscount(
        amount,
        discountPercentage,
      );
      expect(calculatedDiscountedAmount).toBe(expectedDiscountedAmount);
    });
  });

  describe('calculatePercentageValue', () => {
    it('should correctly calculate the value of a percentage of a given amount', () => {
      const amount = 100;
      const percentage = 10;
      const expectedValue = 10;
      const calculatedValue = service.calculatePercentageValue(
        amount,
        percentage,
      );
      expect(calculatedValue).toBe(expectedValue);
    });
  });
});
