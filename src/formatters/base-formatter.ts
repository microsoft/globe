import { TDateTimeFormatOptions } from "../date-time-format-options";
import ILocaleInfo from "../ILocaleInfo";
export interface IFormatter {
  formatDateTime(date: Date, formatOptions: TDateTimeFormatOptions): string;
  // formatNumber(num: number, formatOptions: NumbersFormatOptions): string;
  // formatCurrency(currency: number, formatOptions: CurrencyFormatOptions): string;
}

export abstract class BaseFormatter implements IFormatter {
  constructor(private locale: string | ILocaleInfo) {
  }

  abstract formatDateTime(date: Date, formatOptions: TDateTimeFormatOptions): string;
} 