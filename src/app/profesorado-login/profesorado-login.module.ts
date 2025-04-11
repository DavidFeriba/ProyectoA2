import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfesoradoLoginPageRoutingModule } from './profesorado-login-routing.module';

import { ProfesoradoLoginPage } from './profesorado-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfesoradoLoginPageRoutingModule
  ],
  declarations: [ProfesoradoLoginPage]
})
export class ProfesoradoLoginPageModule {}
