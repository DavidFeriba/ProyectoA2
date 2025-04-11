import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-profesorado-login',
  templateUrl: './profesorado-login.page.html',
  styleUrls: ['./profesorado-login.page.scss'],
  standalone: false
})
export class ProfesoradoLoginPage implements OnInit {
  email: string = '';
    password: string = '';
    constructor(private router:Router, private supabase: SupabaseService) {}
    async login() {
      try {
        const existe = await this.supabase.loginProfesor(this.email, this.password);
        // Aquí se determina el tipo de usuario según la tabla encontrada
        if (existe){
          this.router.navigate(['/profesorado']);
        }else{
          this.supabase.cerrarSesion()
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
      }
    }

  ngOnInit() {
  }

}
