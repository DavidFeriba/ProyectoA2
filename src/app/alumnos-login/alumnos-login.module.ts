import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlumnosLoginPageRoutingModule } from './alumnos-login-routing.module';

import { AlumnosLoginPage } from './alumnos-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlumnosLoginPageRoutingModule
  ],
  declarations: [AlumnosLoginPage]
})
export class AlumnosLoginPageModule {}
