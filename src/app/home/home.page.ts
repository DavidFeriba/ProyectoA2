import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(private router:Router, private supabase:SupabaseService) {}

  async loginPadres(){
    const tipoUsuario = await this.supabase.comprobarLogin()
    if (tipoUsuario == "tutor") {
      this.router.navigate(['/padres'])
    }else{
      this.router.navigate(['/login'])
    }
  }
  async loginProfesorado(){
    const tipoUsuario = await this.supabase.comprobarLogin()
    if (tipoUsuario == "profesor") {
      this.router.navigate(['/profesorado'])
    }else{
      this.router.navigate(['/profesorado-login'])
    }
  }


}
