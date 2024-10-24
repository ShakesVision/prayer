import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Masjid, timeEntry } from 'src/app/models/common';
import { MasjidServiceService } from 'src/app/services/masjid-service.service';

@Component({
  selector: 'masjid-entry',
  templateUrl: './masjid-entry.component.html',
  styleUrls: ['./masjid-entry.component.scss'],
})

export class MasjidEntryComponent implements OnInit {

  @Input() masjid!: Masjid;

  @Output() onMasjidNameClick = new EventEmitter<boolean>();

  @Output() onFavIconClick = new EventEmitter<Masjid>();

  @Output() onTimeClick = new EventEmitter<timeEntry>();


  timeEntries: timeEntry[] = [];

  constructor(private mService: MasjidServiceService) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['masjid'] && this.masjid) {
      this.timeEntries = [
        {
          id: 'fajr',
          urName: 'فجر',
          enName: 'Fajr',
          urLabel: 'فجر',
          enLabel: 'F',
          time: this.masjid.fajr
        },
        {
          id: 'zuhr',
          urName: 'ظہر',
          enName: 'Zuhr',
          urLabel: 'ظہر',
          enLabel: 'Z',
          time: this.masjid.zuhr
        },
        {
          id: 'asr',
          urName: 'عصر',
          enName: 'Asr',
          urLabel: 'عصر',
          enLabel: 'A',
          time: this.masjid.asr
        },
        {
          id: 'maghrib',
          urName: 'مغرب',
          enName: 'Maghrib',
          urLabel: 'مغرب',
          enLabel: 'M',
          time: this.masjid.maghrib
        },
        {
          id: 'isha',
          urName: 'عشاء',
          enName: 'Isha',
          urLabel: 'عشاء',
          enLabel: 'I',
          time: this.masjid.isha
        },
        {
          id: 'juma',
          urName: 'جمعہ',
          enName: 'Juma',
          urLabel: 'جمعہ',
          enLabel: 'J',
          time: this.masjid.juma,
          secondaryTime: this.masjid.jumaBayan
        }
      ]
    }
  }

  getMasjidName(name: string, lang: 'en' | 'ur') {
    return this.mService.getMasjidName(name, lang);
  }

}
