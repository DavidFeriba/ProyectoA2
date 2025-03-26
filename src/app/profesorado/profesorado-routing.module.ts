import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfesoradoPage } from './profesorado.page';

const routes: Routes = [
  {
    path: '',
    component: ProfesoradoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfesoradoPageRoutingModule {}
