import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
  standalone : false
})
export class RegistrarPage implements OnInit {
  email: string = '';
  nombre: string = '';
  apellidos: string ='';
  password: string = '';
  userType: string = 'tutor';
  selectedRole: string = '';
  constructor(private router:ActivatedRoute, private supabaseService: SupabaseService) { }

  ngOnInit() {
  }

  registerTutor() {
    const esPadre = this.userType === 'tutor';  // Asigna el valor basado en la opción seleccionada

    // Llamar a la función de registro con los valores del formulario
    this.supabaseService.registerTutor(this.email, this.password, esPadre,this.nombre,this.apellidos)
      .then(user => {
        console.log('Usuario registrado', user);
        // Aquí puedes redirigir al usuario o mostrar un mensaje
      })
      .catch(error => {
        console.error('Error en el registro:', error);
      });
  }



}
