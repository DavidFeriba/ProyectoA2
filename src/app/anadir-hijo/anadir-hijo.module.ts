import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnadirHijoPageRoutingModule } from './anadir-hijo-routing.module';

import { AnadirHijoPage } from './anadir-hijo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnadirHijoPageRoutingModule
  ],
  declarations: [AnadirHijoPage]
})
export class AnadirHijoPageModule {}
