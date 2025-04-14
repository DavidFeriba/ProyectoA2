import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfesoradoPageRoutingModule } from './profesorado-routing.module';

import { ProfesoradoPage } from './profesorado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfesoradoPageRoutingModule
  ],
  declarations: [ProfesoradoPage]
})
export class ProfesoradoPageModule {}
