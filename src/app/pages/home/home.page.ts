import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { map } from 'rxjs';
import {
  ConsolidatedList,
  Masjid,
  Namaz,
  PrayerDataType,
} from 'src/app/models/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  masjids: Masjid[] = [];
  filteredMasjids: Masjid[] = [];

  prayerData: any;
  timings: {
    enName: string;
    urName: string;
    time: string;
    active: boolean;
  }[] = [];

  currentNamaz: Namaz = '';
  isModalOpen = false;
  salahName: string = '';
  consolidatedList: ConsolidatedList[] = [];

  constructor(
    private http: HttpClient,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.fetchSheetData();
    this.fetchPrayerData();
  }

  fetchSheetData() {
    // const url = "https://script.google.com/macros/s/AKfycbzgdTLYd-4d47kxmsNxfOTqYE4gizk5VjEQXvpcjB-tNLFx_uUPWwVRRp7KTMaBXrRjIw/exec";
    const url =
      'https://script.google.com/macros/s/AKfycbxx1bALccf61Jz-wanrN5GRAtKvuMNmD74CO5GCWI0Mq4v-I_qFqg_lSxlvQXMbF3Y/exec';
    this.http.get<Masjid[]>(url).subscribe((data) => {
      console.log(data);
      this.masjids = data;
      this.filteredMasjids = this.mapDataForUI(data).sort((a, b) =>
        a.masjid.toLocaleLowerCase() > b.masjid.toLocaleLowerCase() ? 1 : -1
      );
      console.log(this.filteredMasjids);
      // this.sort(this.currentNamaz);
    });
  }
  fetchPrayerData() {
    const dateInDdMmYyyy = new Date()
      .toJSON()
      .slice(0, 10)
      .split('-')
      .reverse()
      .join('-');

    // Api end point. Defaults to 24-hour format. Use &iso8601=true for ISO format.
    const url = `https://api.aladhan.com/v1/timingsByCity/${dateInDdMmYyyy}?city=Kamptee&country=India&method=1&school=1`;
    this.http.get<any>(url).subscribe((data) => {
      console.log(data);
      this.prayerData = data.data;
      const timings = data.data.timings;
      const {
        Firstthird,
        Lastthird,
        Imsak,
        Midnight,
        Sunset,
        ...requiredTimings
      } = timings;
      const now = new Date().getHours() + ':' + new Date().getMinutes();
      // const now = new Date((new Date()).getTime() + 840 * 60000);
      console.log(now, timings.Dhuhr, timings.Asr);
      console.log(now, timings.Asr, now < timings.Dhuhr, now < timings.Asr);
      if (timings.Fajr < now && now < timings.Sunrise) this.currentNamaz = 'F';
      // if (timings.Sunrise < now && now < new Date((new Date(timings.Sunrise)).getTime() + 20 * 60000)) this.currentNamaz = "X";
      if (timings.Dhuhr < now && now < timings.Asr) this.currentNamaz = 'Z';
      if (timings.Asr < now && now < timings.Maghrib) this.currentNamaz = 'A';
      if (timings.Maghrib < now && now < timings.Isha) this.currentNamaz = 'M';
      if (timings.Isha < now) this.currentNamaz = 'I';

      console.log(this.currentNamaz);
      this.timings = this.prayerDataPresenter(requiredTimings);
    });
  }

  prayerDataPresenter(timings: PrayerDataType[]) {
    console.log(timings);
    const res = Object.keys(timings).map((key: any) => {
      const data = {
        enName: this.getPrayerCode(key),
        urName: this.getPrayerNameFromLetter(this.getPrayerCode(key) as Namaz)
          .ur,
        time: this.get12HoursFrom24Hours(timings[key]),
        active: this.getPrayerCode(key) === this.currentNamaz,
      };
      return data;
    });

    return res;
  }

  getPrayerCode(prayer: PrayerDataType) {
    const prayerMapping = {
      Fajr: 'F',
      Sunrise: 'R',
      Dhuhr: 'Z',
      Asr: 'A',
      Maghrib: 'M',
      Isha: 'I',
    };
    return prayerMapping[prayer];
  }

  mapDataForUI(data: Masjid[]) {
    data = data.map((masjid) => {
      return {
        masjid: masjid.masjid,
        fajr: this.dateFormatter(masjid.fajr),
        zuhr: this.dateFormatter(masjid.zuhr),
        asr: this.dateFormatter(masjid.asr),
        maghrib: this.dateFormatter(masjid.maghrib),
        isha: this.dateFormatter(masjid.isha),
        juma: this.dateFormatter(masjid.juma),
        jumaBayan: this.dateFormatter(masjid.jumaBayan, false),
      };
    });
    return data;
  }

  filter(ev: any) {
    const query = ev.target.value.toLowerCase();
    this.filteredMasjids = this.mapDataForUI(this.masjids).filter(
      (d) => d.masjid.toLowerCase().indexOf(query) > -1
    );
  }

  sort(p?: Namaz) {
    console.log(p);
    if (p === 'F')
      this.filteredMasjids = this.mapDataForUI(this.masjids).sort((a, b) =>
        a.fajr > b.fajr ? 1 : -1
      );
    else if (p === 'Z') {
      if (new Date().getDay() === 5)
        this.filteredMasjids = this.mapDataForUI(this.masjids).sort((a, b) =>
          a.juma > b.juma ? 1 : -1
        );
      else
        this.filteredMasjids = this.mapDataForUI(this.masjids).sort((a, b) =>
          a.zuhr > b.zuhr ? 1 : -1
        );
    } else if (p === 'A')
      this.filteredMasjids = this.mapDataForUI(this.masjids).sort((a, b) =>
        a.asr > b.asr ? 1 : -1
      );
    else if (p === 'M')
      this.filteredMasjids = this.mapDataForUI(this.masjids).sort((a, b) =>
        a.maghrib > b.maghrib ? 1 : -1
      );
    else if (p === 'I')
      this.filteredMasjids = this.mapDataForUI(this.masjids).sort((a, b) =>
        a.isha > b.isha ? 1 : -1
      );
    else this.filteredMasjids = this.mapDataForUI(this.masjids);
  }

  dateFormatter(dateString: string, hyphenOnInvalideDates = true) {
    if (['', 'Invalid Date'].includes(dateString)) {
      if (!hyphenOnInvalideDates) return '';
      else return '-';
    }
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }

  get12HoursFrom24Hours(time: string) {
    return new Date('1970-01-01T' + time + 'Z').toLocaleTimeString('en-US', {
      timeZone: 'UTC',
      hour12: true,
      hour: 'numeric',
      minute: 'numeric',
    });
  }

  getMasjidName(name: string, lang: 'en' | 'ur') {
    return lang === 'en'
      ? name?.split('-')[0]?.trim()
      : name?.split('-')[1]?.trim();
  }

  getPrayerNameFromLetter(input: Namaz) {
    switch (input) {
      case 'F':
        return {
          en: 'Fajr',
          ur: 'فجر',
        };
      case 'R':
        return {
          en: 'R',
          ur: 'طلوع',
        };
      case 'X':
        return {
          en: 'Makrooh',
          ur: 'مکروہ',
        };
      case 'Z':
        return {
          en: 'Zuhr',
          ur: 'ظہر',
        };
      case 'A':
        return {
          en: 'Asr',
          ur: 'عصر',
        };
      case 'M':
        return {
          en: 'Maghrib',
          ur: 'مغرب',
        };
      case 'I':
        return {
          en: 'Isha',
          ur: 'عشاء',
        };
      default:
        return {
          en: '',
          ur: '',
        };
    }
  }

  getConsolidatedList(
    data: Masjid[],
    propertyName: string
  ): ConsolidatedList[] {
    const groupedData: { [key: string]: string[] } = {};

    data.forEach((item: any) => {
      const time = item[propertyName];
      const masjidName = this.getMasjidName(item.masjid, 'en');
      if (groupedData[time]) {
        groupedData[time].push(masjidName);
      } else {
        groupedData[time] = [masjidName];
      }
    });

    const consolidatedList: ConsolidatedList[] = Object.keys(groupedData).map(
      (time) => {
        return {
          time: time,
          masjids: groupedData[time].sort(),
          missed: this.hasThisTimePassed(time),
        };
      }
    );

    return consolidatedList;
  }

  showUpcomingJamaatTimes(salahName?: any) {
    salahName = this.getPrayerNameFromLetter(salahName ?? this.currentNamaz).en;
    this.consolidatedList = this.getConsolidatedList(
      this.filteredMasjids.filter((m) =>
        Object.values(m).every((value) => value !== '-')
      ),
      salahName.toLowerCase()
    ).sort((a, b) => (a.time > b.time ? 1 : -1));
    console.log(this.consolidatedList);
    this.setOpen(true, salahName);
  }

  hasThisTimePassed(targetTime: string) {
    const currentTime = new Date();
    const [hours, minutes, meridiem] = targetTime.split(/:| /);
    let targetHour = parseInt(hours);
    const targetMinutes = parseInt(minutes);

    if (meridiem.toLowerCase() === 'pm' && targetHour !== 12) {
      targetHour += 12;
    }

    const targetDateTime = new Date();
    targetDateTime.setHours(targetHour, targetMinutes, 0, 0);

    return currentTime > targetDateTime;
  }

  copy() {
    const fajrString = this.masjids
      .map(
        (masjid) =>
          this.getMasjidName(masjid.masjid, 'en') +
          '   ' +
          this.dateFormatter(masjid.fajr)
      )
      .join('\n');
    const zuhrString = this.masjids
      .map(
        (masjid) =>
          this.getMasjidName(masjid.masjid, 'en') +
          '   ' +
          this.dateFormatter(masjid.zuhr)
      )
      .join('\n');
    const asrString = this.masjids
      .map(
        (masjid) =>
          this.getMasjidName(masjid.masjid, 'en') +
          '   ' +
          this.dateFormatter(masjid.asr)
      )
      .join('\n');
    const ishaString = this.masjids
      .map(
        (masjid) =>
          this.getMasjidName(masjid.masjid, 'en') +
          '   ' +
          this.dateFormatter(masjid.isha)
      )
      .join('\n');
    const jumaString = this.masjids
      .map(
        (masjid) =>
          this.getMasjidName(masjid.masjid, 'en') +
          '   ' +
          this.dateFormatter(masjid.juma) +
          '\nJuma Bayan    ' +
          this.dateFormatter(masjid.jumaBayan)
      )
      .join('\n');
    navigator.clipboard.writeText(`
🌅 Fajr
${fajrString}
                          
🌄 Tulu e Aftab         ${this.get12HoursFrom24Hours(
      this.prayerData.timings.Sunrise
    )}

☀️ Zohar 
${zuhrString}

🌤️ Asr
${asrString}

🌅 Gurube Aftab     ${this.get12HoursFrom24Hours(
      this.prayerData.timings.Sunset
    )}

🌠 Magrib              ${this.get12HoursFrom24Hours(
      this.prayerData.timings.Sunset
    )}

🌌 Isha
${ishaString}

🕌 Juma
${jumaString}
    `);
  }

  setOpen(isOpen: boolean, salahName: string | null) {
    this.isModalOpen = isOpen;
    this.salahName = salahName ?? this.currentNamaz;
  }
  async showAlert(message: string, header = '', subHeader = '') {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
