import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DynamicContentPageRoutingModule } from './dynamic-content-routing.module';

import { DynamicContentPage } from './dynamic-content.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DynamicContentPageRoutingModule
  ],
  declarations: [DynamicContentPage]
})
export class DynamicContentPageModule {}
