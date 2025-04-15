import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.page.html',
  styleUrls: ['./alumnos.page.scss'],
  standalone: false
})
export class AlumnosPage implements OnInit {
  vistaSeleccionada: string = 'semana';
  diasSemana: Date[] = [];
  tareasDelDia: any[] = [];
  today: string;
  id: string = '';
  highlightedDates: any[] = [];
  alumno: any = null;
  curso: string = '';
  diaSeleccionado: string = '';

  constructor(
    private router: ActivatedRoute, 
    private router2: Router, 
    private supabase: SupabaseService
  ) {
    this.today = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
    this.router.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  async ngOnInit() {
    this.generarDiasSemana();
    this.cargarFechasConTareas();
    this.alumno = await this.supabase.obtenerAlumno(this.id);
    if (this.alumno) {
      this.curso = this.alumno.curso;
      await this.cargarTareasDelDia(this.today);
    }
  }

  async cargarTareasDelDia(fecha: string) {
    // Cargar las tareas para el día seleccionado
    this.tareasDelDia = await this.supabase.obtenerTareasPorFechaYCurso(fecha, this.curso);
    
    // Obtener el estado de las tareas desde la base de datos
    const tareasCompletadas = await this.supabase.obtenerTareasConEstado(this.id);
    
    // Sincronizar el estado de las tareas
    this.tareasDelDia.forEach(tarea => {
      const tareaCompletada = tareasCompletadas.find(tc => tc.tarea_id === tarea.id);
      if (tareaCompletada) {
        tarea.completada = tareaCompletada.completada;
      }
    });
  }

  generarDiasSemana() {
    const hoy = new Date();
    const diaSemana = hoy.getDay() === 0 ? 7 : hoy.getDay(); // domingo como 7
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - diaSemana + 1);

    this.diasSemana = [];

    for (let i = 0; i < 7; i++) {
      const dia = new Date(lunes);
      dia.setDate(lunes.getDate() + i);
      this.diasSemana.push(dia);
    }
  }

  async cargarFechasConTareas() {
    const fechas = await this.supabase.obtenerFechasConTareas();

    this.highlightedDates = fechas.map(fecha => ({
      date: fecha,
      textColor: '#ffffff',
      backgroundColor: '#007bff'
    }));
  }

  async alSeleccionarFecha(event: any) {
    const fechaSeleccionada = event.detail.value;
    if (!this.curso) return;

    // Cargar tareas para la fecha seleccionada
    await this.cargarTareasDelDia(fechaSeleccionada);
  }

  async alSeleccionarDiaSemana(dia: Date) {
    const fecha = dia.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    this.diaSeleccionado = fecha;
    if (!this.curso) return;

    // Cargar tareas para el día de la semana seleccionado
    await this.cargarTareasDelDia(fecha);
  }

  async toggleTareaCompletada(tarea: any) {
    const nuevoEstado = !tarea.completada; // Invertir el estado

    // Actualizar la base de datos con el nuevo estado
    await this.supabase.actualizarEstadoTarea(this.id, tarea.id, nuevoEstado);

    // Actualizar el estado en el componente
    tarea.completada = nuevoEstado;
  }
  cerrarSesion(){
    this.router2.navigate(['/home'])
  }
}
