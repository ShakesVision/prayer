import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Masjid } from 'src/app/models/common';
import { MasjidServiceService } from 'src/app/services/masjid-service.service';

@Component({
  selector: 'masjid-entry',
  templateUrl: './masjid-entry.component.html',
  styleUrls: ['./masjid-entry.component.scss'],
})
export class MasjidEntryComponent  implements OnInit {

  @Input() masjid!: Masjid;

  @Output() onMasjidNameClick = new EventEmitter<boolean>();
  @Output() onFavIconClick = new EventEmitter<Masjid>();

  constructor(private mService: MasjidServiceService) { }

  ngOnInit() {}

  getMasjidName(name: string, lang: 'en' | 'ur') {
    return this.mService.getMasjidName(name,lang);
  }
 
}
