import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlumnosLoginPage } from './alumnos-login.page';

const routes: Routes = [
  {
    path: '',
    component: AlumnosLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlumnosLoginPageRoutingModule {}
