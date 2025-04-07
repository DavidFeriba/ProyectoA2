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
  cursos:string[] = [];
  curso:string = '';
  asignaturas:string[] = [];
  asignatura:string = ''

  constructor(private router:ActivatedRoute, private supabaseService: SupabaseService) { }

  ngOnInit() {
  }

  registerTutor() { 

    // Llamar a la función de registro con los valores del formulario
    this.supabaseService.registerTutor(this.email, this.password, this.userType,this.nombre,this.apellidos)
      .then(user => {
        console.log('Usuario registrado', user);
        // Aquí puedes redirigir al usuario o mostrar un mensaje
      })
      .catch(error => {
        console.error('Error en el registro:', error);
      });
  }
  registerProfesor() {
    // Llamar a la función de registro con los valores del formulario
    this.supabaseService.registerProfesor(this.email, this.password, this.asignaturas, this.cursos,this.nombre,this.apellidos)
      .then(user => {
        console.log('Usuario registrado', user);
        // Aquí puedes redirigir al usuario o mostrar un mensaje
      })
      .catch(error => {
        console.error('Error en el registro:', error);
      });
  }
  anadirAsignatura() {
    if(this.asignaturas.length < 8){
      this.asignaturas.push(this.asignatura)
    }
    
  }
  eliminarAsignatura(asignatura: string) {
    const i = this.asignaturas.indexOf(asignatura)
    this.asignaturas.splice(i, 1);
  }
  anadirCurso(){
    if(this.cursos.length < 8){
      this.cursos.push(this.curso)
    }
  }
  eliminarCurso(curso: string) {
    const i = this.asignaturas.indexOf(curso)
    this.cursos.splice(i, 1);
  }



}
