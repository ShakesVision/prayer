export interface Masjid {
  masjid: string;
  fajr: string;
  zuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  juma: string;
  jumaBayan: string;
  isFav?: boolean;
}
export interface ConsolidatedList {
  time: string;
  masjids: string[];
  missed: boolean;
}
export interface AppPages {
  title: string;
  url: 'todo' | 'help' | 'changelog' | 'about' | 'playstore';
  icon: string;
}
export type Namaz = 'F' | 'R' | 'X' | 'Z' | 'A' | 'M' | 'I' | 'J' | '';
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
export interface timeEntry {
  id: string;
  urName: string;
  enName: string;
  urLabel: string;
  enLabel: string;
  time: string;
  secondaryTime?: string;
}