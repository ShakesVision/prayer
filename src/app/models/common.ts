export interface Masjid {
    masjid: string,
    fajr: string,
    zuhr: string,
    asr: string,
    maghrib: string,
    isha: string,
    juma: string,
    jumaBayan: string
}
export type Namaz = "F" | "R" | "X" | "Z" | "A" | "M" | "I" | "";
export type PrayerDataType = 'Fajr'|'Sunrise'|'Dhuhr'|'Asr'|'Maghrib'|'Isha';