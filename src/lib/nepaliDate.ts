import NepaliDate from 'nepali-date-converter';

export function getCurrentNepaliDate(): string {
  const nepaliDate = new NepaliDate();
  return nepaliDate.format("YYYY/MM/DD");
}

export function toNepaliDateObj(date: Date): string {
  const nepaliDate = new NepaliDate(date);
  return nepaliDate.format("YYYY/MM/DD");
}
