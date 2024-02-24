import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DynamicContentPage } from './dynamic-content.page';

const routes: Routes = [
  {
    path: '',
    component: DynamicContentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DynamicContentPageRoutingModule {}
