import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { catchError, switchMap } from 'rxjs';
import {
  ConsolidatedList,
  Masjid,
  Namaz,
  PrayerDataType,
  timeEntry,
} from 'src/app/models/common';
import { LocationListType, MasjidServiceService } from 'src/app/services/masjid-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  masjids: Masjid[] = [];
  filteredMasjids: Masjid[] = [];
  sortDirection: 'asc' | 'desc' = 'asc';

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

  favMasjidNames: string[] = [];
  favMasjids: Masjid[] = [];

  modalLang: 'en' | 'ur' = 'en';

  selectedLocation!: LocationListType;

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private toastController: ToastController,
    public mService: MasjidServiceService
  ) { }

  ngOnInit() {
    this.reset();
  }

  fetchSheetData() {
    this.mService.selectedLocation$
      .pipe(
        switchMap(location => {
          this.selectedLocation = location;
          console.log(location);
          const url1 = location.url1;
          const url2 = location.url2;

          this.fetchPrayerData();

          // Attempt to fetch from url1
          return this.http.get<Masjid[]>(url1).pipe(
            catchError(err => {
              console.error('Error fetching from url1:', err);
              // On error, try fetching from url2
              return this.http.get<Masjid[]>(url2).pipe(
                catchError(err => {
                  console.error('Error fetching from url2:', err);
                  // If both requests fail, return an empty array or handle as needed
                  return []; // Or throwError(err) to propagate the error
                })
              );
            })
          );
        })
      )
      .subscribe(
        data => {
          // Handle successful response (from url1 or url2)
          this.masjids = data;
          localStorage.setItem('masjids', JSON.stringify(this.masjids));
          this.getFavMasjidsAndRender();
          this.updateFilteredMasjid();
        },
        err => {
          console.error('Final error handling:', err);
          // Handle the case where both API calls failed
          const dataFromLocalStorage = localStorage.getItem('masjids');
          if (dataFromLocalStorage) {
            this.masjids = JSON.parse(dataFromLocalStorage);
            this.getFavMasjidsAndRender();
            this.updateFilteredMasjid();
          }
          this.showToast('Error getting the masaajid data.');
        }
      );
  }
  fetchPrayerData() {
    const dateInDdMmYyyy = new Date()
      .toJSON()
      .slice(0, 10)
      .split('-')
      .reverse()
      .join('-');

    // Api end point. Defaults to 24-hour format. Use &iso8601=true for ISO format.
    const url = `https://api.aladhan.com/v1/timingsByCity/${dateInDdMmYyyy}?city=${this.selectedLocation.name}&country=India&method=1&school=1`;
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
      if (timings.Isha < now && now < this.convertToNextDay(timings.Fajr))
        this.currentNamaz = 'I';

      console.log(this.currentNamaz);
      this.timings = this.prayerDataPresenter(requiredTimings);
    });
  }
  getFavMasjidsAndRender() {
    const favData = localStorage.getItem('fav');
    this.favMasjidNames = favData ? JSON.parse(favData) : [];
    // Append isFav record with every masjid to track the bookmarks.
    this.masjids = this.masjids.map(m => {
      return {
        ...m,
        isFav: this.favMasjidNames.includes(m.masjid)
      }
    });
    // Map favorite masjids for UI.
    let favMasjidData = this.masjids.filter(m => this.favMasjidNames.includes(m.masjid));

    this.favMasjids = this.mapDataForUI(favMasjidData);
    this.filteredMasjids = this.mapDataForUI(this.masjids).sort((a, b) =>
      a.masjid.toLocaleLowerCase() > b.masjid.toLocaleLowerCase() ? 1 : -1
    );
  }
  convertToNextDay(timeString: string) {
    const [hoursStr, minutesStr] = timeString.split(':');
    let hours = parseInt(hoursStr);

    hours += 24;

    // Format hours and minutes back into string format
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedTime = `${formattedHours}:${minutesStr}`;

    return formattedTime;
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

  updateFilteredMasjid() {
    this.filteredMasjids = this.mapDataForUI(this.masjids).sort((a, b) =>
      a.masjid.toLocaleLowerCase() > b.masjid.toLocaleLowerCase() ? 1 : -1
    );
  }

  mapDataForUI(data: Masjid[]) {
    data = data.map((masjid) => {
      return {
        masjid: masjid.masjid,
        fajr: this.dateFormatter(masjid.fajr),
        zuhr: this.dateFormatter(masjid.zuhr),
        asr: this.dateFormatter(masjid.asr),
        maghrib: this.areFourNamazTimesInvalid(masjid) ? '-' : (this.prayerData
          ? this.get12HoursFrom24Hours(this.prayerData.timings.Sunset)
          : this.dateFormatter(masjid.maghrib)),
        isha: this.dateFormatter(masjid.isha),
        juma: this.dateFormatter(masjid.juma),
        jumaBayan: this.dateFormatter(masjid.jumaBayan, false),
        isFav: masjid.isFav
      };
    });
    return data;
  }
  areFourNamazTimesInvalid(masjid: Masjid): boolean {
    const times = [masjid.fajr, masjid.zuhr, masjid.asr, masjid.isha];
    const invalidTimes = times.filter(time => ['', 'Invalid Date'].includes(time));
    return invalidTimes.length === 4;
  }
  filter(ev: any) {
    const query = ev.target.value.toLowerCase();
    if (query === '') {
      this.updateFilteredMasjid();
      return;
    }
    this.filteredMasjids = this.mapDataForUI(this.masjids).filter(
      (d) => d.masjid.toLowerCase().indexOf(query) > -1
    );
  }

  showSortOptions() {
    this.alertController.create({
      header: 'Sort by',
      inputs: [
        {
          name: 'sortOption',
          type: 'radio',
          label: 'Masjid Name',
          value: 'masjid',
          checked: true
        },
        {
          name: 'sortOption',
          type: 'radio',
          label: 'Fajr Time',
          value: 'fajr'
        },
        {
          name: 'sortOption',
          type: 'radio',
          label: 'Zuhr Time',
          value: 'zuhr'
        },
        {
          name: 'sortOption',
          type: 'radio',
          label: 'Asr Time',
          value: 'asr'
        },
        {
          name: 'sortOption',
          type: 'radio',
          label: 'Maghrib Time',
          value: 'maghrib'
        },
        {
          name: 'sortOption',
          type: 'radio',
          label: 'Isha Time',
          value: 'isha'
        },
        {
          name: 'sortOption',
          type: 'radio',
          label: 'Juma Time',
          value: 'juma'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Sort',
          handler: (data) => {
            console.log(data);
            this.sort(data);
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
  }
  sort(field: string) {
    this.filteredMasjids = this.mapDataForUI(this.masjids).sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredMasjids.reverse();
  }

  sortByPrayer(p?: Namaz) {
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

  getPrayerNameFromLetter(input: string) {
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
      case 'J':
        return {
          en: 'Juma',
          ur: 'جمعہ',
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
      // const masjidName = this.mService.getMasjidName(item.masjid, 'en');
      const masjidName = item.masjid;
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

  showUpcomingJamaatTimes(prayerIdChar = 'X') {
    let salahName = this.getPrayerNameFromLetter(prayerIdChar === 'X' ? this.currentNamaz : prayerIdChar).en;

    // if UI big button is clicked to show upcoming jamaat times, and today is friday, set salahName to 'Juma'
    if (prayerIdChar === 'X' && new Date().getDay() === 5) salahName = 'Juma';

    this.consolidatedList = this.getConsolidatedList(
      this.filteredMasjids.filter((m) => {
        const salahId = salahName.toLowerCase();
        // filter out masjids that have '-' in their salah time
        return m[salahId as keyof Masjid] !== '-'
      }),
      salahName.toLowerCase()
    ).sort((a, b) => (a.time > b.time ? 1 : -1));

    console.log(salahName, this.consolidatedList);
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

  async copy() {
    const fajrString = this.masjids
      .map(
        (masjid) =>
          this.mService.getMasjidName(masjid.masjid, 'en') +
          '   ' +
          this.dateFormatter(masjid.fajr)
      )
      .join('\n');
    const zuhrString = this.masjids
      .map(
        (masjid) =>
          this.mService.getMasjidName(masjid.masjid, 'en') +
          '   ' +
          this.dateFormatter(masjid.zuhr)
      )
      .join('\n');
    const asrString = this.masjids
      .map(
        (masjid) =>
          this.mService.getMasjidName(masjid.masjid, 'en') +
          '   ' +
          this.dateFormatter(masjid.asr)
      )
      .join('\n');
    const ishaString = this.masjids
      .map(
        (masjid) =>
          this.mService.getMasjidName(masjid.masjid, 'en') +
          '   ' +
          this.dateFormatter(masjid.isha)
      )
      .join('\n');
    const jumaString = this.masjids
      .map(
        (masjid) =>
          this.mService.getMasjidName(masjid.masjid, 'en') +
          '   ' +
          this.dateFormatter(masjid.juma) +
          '\nJuma Bayan    ' +
          this.dateFormatter(masjid.jumaBayan)
      )
      .join('\n');

    const textToCopy = `🌅 Fajr
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
          `;
    try {
      await navigator.clipboard.writeText(textToCopy);
      this.showAlert(
        'Prayer timings with mosque names have been copied to the clipboard. Paste it wherever you want!',
        'Copied successfully'
      );
    } catch (error: any) {
      this.showAlert(error?.message, 'Error!');
      console.error(error?.message);
    }
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

  async showToast(message: string, header = '') {
    const alert = await this.toastController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  onLongPress() {
    console.log('Long press detected!');
    // Implement your logic here
  }

  /**
   * Adds a value to the array if it doesn't exist, or removes it if it does.
   * @param arr The array to add/remove from.
   * @param value The value to add/remove.
   * @returns The modified array.
   */
  addOrRemove(arr: string[], value: string): string[] {
    if (arr.includes(value)) {
      return arr.filter(item => item !== value);
    } else {
      return [...arr, value];
    }
  }

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Favorite the given masjid. If the masjid is already favorited,
   * remove it from the favorite list. Otherwise, add it to the list.
   * After modifying the favorite list, re-render the favorite list.
   * @param masjid The masjid to favorite or unfavorite.
   */
  /******  3cf82af1-12fa-4a13-92f6-5847155279a5  *******/
  fav(masjid: Masjid) {
    // Favorite the item. If already favorited, remove from the fav list.
    this.favMasjidNames = this.addOrRemove(this.favMasjidNames, masjid.masjid);
    localStorage.setItem('fav', JSON.stringify(this.favMasjidNames));
    this.getFavMasjidsAndRender();
  }

  getMasjidDataFromName(name: string) {
    return this.masjids.find(m => m.masjid === name);
  }

  /**
   * Called when the user pulls to refresh the page.
   * Resets all configurations and fetches the data again.
   * @param event The event object passed from the ion-refresher component.
   */
  async doRefresh(event: any) {
    console.log('Begin async operation');

    // Reset all configurations and fetch data again
    this.reset();

    // Complete the refresher event
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  /**
   * Opens a popup with a list of masjids that have not missed the time according to the consolidated list.
   * The user can click on a masjid to go to the page with the map and directions.
   * @param consolidatedList The consolidated list of prayer times.
   */
  async openWhereToGoPopup() {
    let salahName = this.getPrayerNameFromLetter(this.currentNamaz).en;
    const availableMasjids =
      this.getConsolidatedList(
        this.filteredMasjids.filter((m) => {
          const salahId = salahName.toLowerCase();
          // filter out masjids that have '-' in their salah time
          return m[salahId as keyof Masjid] !== '-'
        }),
        salahName.toLowerCase()
      ).filter(a => !a.missed).sort((a, b) => (a.time > b.time ? 1 : -1));
console.log(availableMasjids);
    // if there are no available masjids, do not open the popup
    if (availableMasjids.length === 0) return false;

    // Open popup
    const alert = await this.alertController.create({
      header: 'Where to go?',
      message: 'The following masjids have not missed the time:' + availableMasjids.join('<br>'),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
      ],
    });

    await alert.present();
    return true;
  }

  /**
   * Resets all configurations and fetches the data again.
   * Called from ngOnInit and doRefresh.
   */
  reset() {
    this.masjids = [];
    this.filteredMasjids = [];
    this.prayerData = {};
    this.timings = [];
    this.favMasjids = [];
    this.fetchSheetData();
  }
}
