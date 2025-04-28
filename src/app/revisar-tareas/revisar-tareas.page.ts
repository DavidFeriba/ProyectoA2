import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-revisar-tareas',
  templateUrl: './revisar-tareas.page.html',
  styleUrls: ['./revisar-tareas.page.scss'],
  standalone : false
})
export class RevisarTareasPage implements OnInit {
  idAlumno: string = '';
  tareas: any[] = [];
  curso: string = ''
  idProfesor: string = ''
  todasLasTareas: any[] = []
  constructor(private route: ActivatedRoute, private supabase: SupabaseService) { }

  async ngOnInit() {
    this.todasLasTareas = await this.supabase.getTareasProfesor()
    this.route.queryParams.subscribe(params => {
      this.idAlumno = params['idAlumno']
      this.idProfesor = params['idProfesor']
      this.curso = params['curso']
      if (this.idAlumno) {
        this.cargarTareas()
      }else{
        this.cargarTodasTareas()
      }

    })
  }
  async cargarTareas() {
    this.tareas = await this.supabase.obtenerDetallesTareasConFoto(this.idAlumno, this.idProfesor);
    console.log(this.tareas);
  }
  async cargarTodasTareas(){
    this.tareas = await this.supabase.obtenerTareasTodas(this.idProfesor, this.curso)
    console.log(this.tareas)
  }
  async aceptarTarea(tarea: any) {
    console.log('Tarea:', tarea.tareas.id);
    console.log('ID Alumno:', this.idAlumno);

    try {
      await this.supabase.actualizarEstadoTareaCompletada(
        tarea.tareas.id,
        Number(this.idAlumno),  // Convertir idAlumno de string a número
        true
      );
      console.log('tareaid: ', tarea.tareas.id)
      this.tareas = this.tareas.filter(t => t.tareas.id !== tarea.tareas.id);
    } catch (error) {
      console.error('Error al aceptar la tarea:', error);
    }
  }
  async rechazarTarea(tarea: any) {
    try {
      await this.supabase.actualizarEstadoTareaCompletada(tarea.tareas.id, Number(this.idAlumno), false);
      this.tareas = this.tareas.filter(t => t.tareas.id !== tarea.tareas.id);
    } catch (error) {
      console.error('Error al rechazar la tarea:', error);
    }
  }

}
