import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfesoradoLoginPage } from './profesorado-login.page';

const routes: Routes = [
  {
    path: '',
    component: ProfesoradoLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfesoradoLoginPageRoutingModule {}
