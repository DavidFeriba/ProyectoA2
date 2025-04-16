import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RevisarTareasPage } from './revisar-tareas.page';

const routes: Routes = [
  {
    path: '',
    component: RevisarTareasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RevisarTareasPageRoutingModule {}
