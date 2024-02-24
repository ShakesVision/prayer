export interface Masjid {
  masjid: string;
  fajr: string;
  zuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  juma: string;
  jumaBayan: string;
}
export interface ConsolidatedList {
  time: string;
  masjids: string[];
}
export type Namaz = 'F' | 'R' | 'X' | 'Z' | 'A' | 'M' | 'I' | '';
export type NamazFull =
  | 'Fajr'
  | 'Sunrise'
  | 'Makrooh'
  | 'Zuhr'
  | 'Asr'
  | 'Maghrib'
  | 'Isha'
  | '';
export type PrayerDataType =
  | 'Fajr'
  | 'Sunrise'
  | 'Dhuhr'
  | 'Asr'
  | 'Maghrib'
  | 'Isha';
