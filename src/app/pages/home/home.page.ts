import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Masjid } from 'src/app/models/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  masjids: Masjid[] = [];
  filteredMasjids: Masjid[] = [];

  prayerData: any;

  currentNamaz: "" | "F" | "Z" | "A" | "M" | "I" | "X" = "";

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchSheetData();
    this.fetchPrayerData();
  }

  fetchSheetData() {
    const url = "https://script.google.com/macros/s/AKfycbzgdTLYd-4d47kxmsNxfOTqYE4gizk5VjEQXvpcjB-tNLFx_uUPWwVRRp7KTMaBXrRjIw/exec";
    this.http.get<Masjid[]>(url).pipe(map(((masjids: Masjid[]) => masjids.map(masjid => {
      return (
        {
          masjid: masjid.masjid,
          fajr: this.dateFormatter(masjid.fajr),
          zuhr: this.dateFormatter(masjid.zuhr),
          asr: this.dateFormatter(masjid.asr),
          maghrib: this.dateFormatter(masjid.maghrib),
          isha: this.dateFormatter(masjid.isha),
          juma: this.dateFormatter(masjid.juma),
          jumaBayan: this.dateFormatter(masjid.jumaBayan, false),
        }
      )
    }).sort((a, b) => a.masjid.toLocaleLowerCase() > b.masjid.toLocaleLowerCase() ? 1 : -1)
    )
    )).subscribe((data) => {
      console.log(data);
      this.masjids = data;
      this.filteredMasjids = data;
    })
  }
  fetchPrayerData() {
    const url = "https://api.aladhan.com/v1/timingsByCity/22-02-2024?city=Kamptee&country=India&method=1&school=1&iso8601=true";
    this.http.get<any>(url).subscribe((data) => {
      console.log(data);
      this.prayerData = data.data;
      const timings = data.data.timings;

      const now = new Date();
      // const now = new Date((new Date()).getTime() + 840 * 60000);
      // console.log(now, timings.Dhuhr, timings.Asr);
      // console.log(now, new Date(timings.Asr), now < new Date(timings.Asr).setDate(new Date()));
      if (new Date(timings.Fajr) < now && now < new Date(timings.Sunrise)) this.currentNamaz = "F";
      if (new Date(timings.Sunrise) < now && now < new Date((new Date(timings.Sunrise)).getTime() + 20 * 60000)) this.currentNamaz = "X";
      if (new Date(timings.Dhuhr) < now && now < new Date(timings.Asr)) this.currentNamaz = "Z";
      if (new Date(timings.Asr) < now && now < new Date(timings.Maghrib)) this.currentNamaz = "A";
      if (new Date(timings.Maghrib) < now && now < new Date(timings.Isha)) this.currentNamaz = "M";
      if (new Date(timings.Isha) < now && now < new Date(timings.Fajr)) this.currentNamaz = "I";

      console.log(this.currentNamaz);
    })
  }



  filter(ev: any) {
    const query = ev.target.value.toLowerCase();
    // this.filteredMasjids = this.masjids.filter(d => d.masjid.toLowerCase().indexOf(query) > -1);
    this.filteredMasjids = this.masjids.filter((d) => d.masjid.toLowerCase().indexOf(query) > -1);
  }

  sort(p?: any) {
    console.log(p);
    if (p === 'F') this.filteredMasjids = this.masjids.sort((a, b) => a.fajr > b.fajr ? 1 : -1);
    else if (p === 'Z') this.filteredMasjids = this.masjids.sort((a, b) => a.zuhr > b.zuhr ? 1 : -1);
    else if (p === 'A') this.filteredMasjids = this.masjids.sort((a, b) => a.asr > b.asr ? 1 : -1);
    else if (p === 'M') this.filteredMasjids = this.masjids.sort((a, b) => a.maghrib > b.maghrib ? 1 : -1);
    else if (p === 'I') this.filteredMasjids = this.masjids.sort((a, b) => a.isha > b.isha ? 1 : -1);
    else this.filteredMasjids = this.masjids;
  }

  dateFormatter(dateString: string, hyphenOnInvalideDates = true) {
    if (['', 'Invalid Date'].includes(dateString)) {
      if (!hyphenOnInvalideDates) return '';
      else return '-'
    };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  }
  getMasjidName(name: string, lang: 'en' | 'ur') {
    return lang === 'en' ?
      name?.split('-')[0]?.trim()
      : name?.split('-')[1]?.trim();

  }
  copy() {
    navigator.clipboard.writeText(`
🌅  Fajr
${this.masjids.forEach(masjid => masjid.masjid + '   ' + masjid.fajr)}
                          
🌄 Tulu e Aftab         ${this.prayerData.timings.Sunrise}

☀️Zohar 
${this.masjids.forEach(masjid => masjid.masjid + '   ' + masjid.zuhr)}

🌤️ Asr
${this.masjids.forEach(masjid => masjid.masjid + '   ' + masjid.asr)}

🌅Gurube Aftab     ${this.prayerData.timings.Sunset}

🌠 Magrib              ${this.prayerData.timings.Sunset}

🌌 Isha
${this.masjids.forEach(masjid => masjid.masjid + '   ' + masjid.isha)}

🕌Juma
${this.masjids.forEach(masjid => masjid.masjid + '   ' + masjid.juma + '\nJuma Bayan    ' + masjid.jumaBayan)}

    `);
  }
}
