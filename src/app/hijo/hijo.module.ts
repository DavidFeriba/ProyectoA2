import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HijoPageRoutingModule } from './hijo-routing.module';

import { HijoPage } from './hijo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HijoPageRoutingModule
  ],
  declarations: [HijoPage]
})
export class HijoPageModule {}
