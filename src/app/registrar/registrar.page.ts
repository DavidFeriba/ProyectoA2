import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
  standalone : false
})
export class RegistrarPage implements OnInit {
  alertButtons = ['Entendido'];
  email: string = '';
  nombre: string = '';
  apellidos: string ='';
  password: string = '';
  rol: string = 'madre';
  cursos:string[] = [];
  curso:string = '';
  asignaturas:string[] = [];
  asignatura:string = ''
  emailInvalidoTutor: boolean = false;
  nombreInvalidoTutor: boolean = false;
  apellidosInvalidoTutor: boolean = false;
  passwordInvalidoTutor: boolean = false;
  emailInvalidoProfesor: boolean = false;
  nombreInvalidoProfesor: boolean = false;
  apellidosInvalidoProfesor: boolean = false;
  passwordInvalidoProfesor: boolean = false;
  asignaturasInvalido: boolean = false;
  cursosInvalido: boolean = false
  confirmarContra: string = ''
  confirmarContraErrorTutor : boolean = false;
  confirmarContraErrorProfesor : boolean = false;
  verContra: boolean = false;

  constructor(private toastController: ToastController, private router:ActivatedRoute, private supabaseService: SupabaseService) { }

  ngOnInit() {
  }

  async registerTutor() {
    this.confirmarContraErrorTutor = this.password !== this.confirmarContra;

    this.emailInvalidoTutor = !this.email || !this.email.includes('@');
    this.nombreInvalidoTutor = !this.nombre || this.nombre.trim().length < 2;
    this.apellidosInvalidoTutor = !this.apellidos || this.apellidos.trim().length < 2;
    this.passwordInvalidoTutor = !this.password || this.password.length < 6;


    const hayErrores = this.emailInvalidoTutor || this.nombreInvalidoTutor || this.apellidosInvalidoTutor || this.passwordInvalidoTutor || this.asignaturasInvalido || this.cursosInvalido || this.confirmarContraErrorTutor;
    const isCorreoRepetido = await this.correoRepetido()
    if (hayErrores || isCorreoRepetido) return;
    // Llamar a la función de registro con los valores del formulario
    this.supabaseService.registerTutor(this.email, this.password, this.rol,this.nombre,this.apellidos)
      .then(user => {
        this.mostrarToast("¡Registrado con éxito! Revisa tu correo (y el spam)", "success");
        // Aquí puedes redirigir al usuario o mostrar un mensaje
      })
      .catch(error => {
        console.error('Error en el registro:', error);
      });
  }
  async registerProfesor() {
    this.confirmarContraErrorProfesor = this.password !== this.confirmarContra;

    this.emailInvalidoProfesor = !this.email || !this.email.includes('@');
    this.nombreInvalidoProfesor = !this.nombre || this.nombre.trim().length < 2;
    this.apellidosInvalidoProfesor = !this.apellidos || this.apellidos.trim().length < 2;
    this.passwordInvalidoProfesor = !this.password || this.password.length < 6;
    this.asignaturasInvalido = this.asignaturas.length < 1
    this.cursosInvalido = this.cursos.length < 1

    const hayErrores = this.emailInvalidoProfesor || this.nombreInvalidoProfesor || this.apellidosInvalidoProfesor || this.passwordInvalidoProfesor || this.confirmarContraErrorProfesor;
    const isCorreoRepetido = await this.correoRepetido()
    if (hayErrores || isCorreoRepetido) return;
    // Llamar a la función de registro con los valores del formulario
    this.supabaseService.registerProfesor(this.email, this.password, this.asignaturas, this.cursos,this.nombre,this.apellidos)
      .then(user => {
        this.mostrarToast("¡Registrado con éxito! Revisa tu correo (y el spam)", "success");
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
    this.asignatura = ''

  }
  eliminarAsignatura(asignatura: string) {
    const i = this.asignaturas.indexOf(asignatura)
    this.asignaturas.splice(i, 1);
  }
  anadirCurso(){
    if (!this.comprobarCurso(this.curso)) {
      this.mostrarToast("Formato de curso inválido. Usa formatos como '1A', '2B'...", "danger");
      return;
    }
    if(this.cursos.length < 8 && !this.cursos.includes(this.curso)){
      this.cursos.push(this.curso)
      this.curso = '';
    }
    this.curso = ''
  }
  eliminarCurso(curso: string) {
    const i = this.asignaturas.indexOf(curso)
    this.cursos.splice(i, 1);
  }
  comprobarCurso(curso: string): boolean {
    const regex = /^[1-6][A-B]$/; // Acepta 1A, 1B, 2A, ..., 6B
    return regex.test(curso);
  }

  debug(){
    console.log(this.rol);
  }
  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'top',
    });
    await toast.present();
    console.log("toast")
  }
  async correoRepetido() {
      // Llamamos a la función obtenerCorreos() que devuelve una promesa
      const correos = await this.supabaseService.obtenerCorreos();

      // Verificamos si el correo ya existe en el array
      if (correos.includes(this.email)) {
        this.mostrarToast("Este correo ya dispone de una cuenta activa", "danger")
        return true
      } else {
        return false
      }
  }



}
