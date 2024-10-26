import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type LocationListType = {
  id: string,
  name: string,
  latitude: string,
  longitude: string,
  url1: string;
  url2: string;
}

@Injectable({
  providedIn: 'root'
})

export class MasjidServiceService {


  locations: LocationListType[] = [{
    id: 'kamptee',
    name: 'Kamptee',
    latitude: '21.20865304692412',
    longitude: '79.18512541403561',
    url1:
      'https://script.google.com/macros/s/AKfycbxx1bALccf61Jz-wanrN5GRAtKvuMNmD74CO5GCWI0Mq4v-I_qFqg_lSxlvQXMbF3Y/exec',
    url2:
      'https://script.google.com/macros/s/AKfycbzgdTLYd-4d47kxmsNxfOTqYE4gizk5VjEQXvpcjB-tNLFx_uUPWwVRRp7KTMaBXrRjIw/exec'
  }];

  selectedLocation$ = new BehaviorSubject<LocationListType>(this.locations[0]);

  constructor() { }

  ngOnInit() {
    this.loadLocations();
  }

  getMasjidName(name: string, lang: 'en' | 'ur') {
    return lang === 'en'
      ? name?.split('-')[0]?.trim()
      : name?.split('-')[1]?.trim();
  }

  updateLocation(data: LocationListType) {
    const index = this.locations.findIndex(location => location.id === data.id);
    if (index !== -1) {
      this.locations[index] = data;
      this.saveLocations();
    }
  }

  saveLocations() {
    localStorage.setItem('locations', JSON.stringify(this.locations));
  }

  loadLocations() {
    const storedLocations = localStorage.getItem('locations');
    if (storedLocations) {
      this.locations = JSON.parse(storedLocations);
    }
    console.log(this.locations);
  }
}
