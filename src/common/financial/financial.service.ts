import { Injectable } from '@nestjs/common';

@Injectable()
export class FinancialService {
  calculateTax(amount: number, taxRate: number): number {
    return amount * (taxRate / 100);
  }

  calculateTotalWithTax(amount: number, taxRate: number): number {
    const taxAmount = this.calculateTax(amount, taxRate);
    return amount + taxAmount;
  }

  applyDiscount(amount: number, discountPercentage: number): number {
    return amount - amount * (discountPercentage / 100);
  }

  calculatePercentageValue(amount: number, percentage: number): number {
    return amount * (percentage / 100);
  }
}
