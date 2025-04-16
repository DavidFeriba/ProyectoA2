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
  idProfesor: string = ''
  todasLasTareas: any[] = []
  constructor(private route: ActivatedRoute, private supabase: SupabaseService) { }

  async ngOnInit() {
    this.todasLasTareas = await this.supabase.getTareasProfesor()
    this.route.queryParams.subscribe(params => {
      this.idAlumno = params['idAlumno']
      this.idProfesor = params['idProfesor']
      this.cargarTareas()
    })
  }
  async cargarTareas() {
    this.tareas = await this.supabase.obtenerDetallesTareasConFoto(this.idAlumno, this.idProfesor);
    console.log(this.tareas);
  }
  aceptarTarea(tarea:any){

  }
  rechazarTarea(tarea:any){

  }

}
