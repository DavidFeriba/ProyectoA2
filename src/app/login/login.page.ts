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
      const { user, error } = await this.supabase.login(this.email, this.password);

      if (error) {
        console.error('Error de inicio de sesión:', error);
        return;
      }

      // Aquí se determina el tipo de usuario según la tabla encontrada
      if (user){
        this.router.navigate(['/padres']);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }
  ngOnInit() {
  }

}
