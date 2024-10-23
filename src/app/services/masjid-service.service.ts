import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MasjidServiceService {

  constructor() { }

  getMasjidName(name: string, lang: 'en' | 'ur') {
    return lang === 'en'
      ? name?.split('-')[0]?.trim()
      : name?.split('-')[1]?.trim();
  }
}
