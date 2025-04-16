import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RevisarTareasPageRoutingModule } from './revisar-tareas-routing.module';

import { RevisarTareasPage } from './revisar-tareas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RevisarTareasPageRoutingModule
  ],
  declarations: [RevisarTareasPage]
})
export class RevisarTareasPageModule {}
