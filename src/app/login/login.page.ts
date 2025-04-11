import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
email: string = '';
  password: string = '';
  constructor(private router:Router, private supabase: SupabaseService) {}
  async login() {
    try {
      const existe = await this.supabase.loginTutor(this.email, this.password);
      // Aquí se determina el tipo de usuario según la tabla encontrada
      if (existe){
        this.router.navigate(['/padres']);
      }else{
        this.supabase.cerrarSesion()
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }
  async ngOnInit() {
    
  }

}
