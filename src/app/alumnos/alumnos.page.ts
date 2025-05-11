import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { IonModal } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';

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
  logros: any[] = []
  selectedPhoto: string = ''

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

    this.alumno = await this.supabase.obtenerAlumno(this.id);
    if (this.alumno) {
      this.curso = this.alumno.curso;
      await this.cargarTareasDelDia(this.today);
    }
    this.cargarFechasConTareas();
    await this.comprobarLogros()
    await this.obtenerLogros()
    console.log("logros: ",this.logros)



  }
  async comprobarLogros() {
      await this.supabase.comprobarLogros(this.id)
  }
  async obtenerLogros(){
    this.logros = (await this.supabase.obtenerLogros(this.id)) ?? [];
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
    const fechas = await this.supabase.obtenerFechasConTareas(this.curso);

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
    this.diaSeleccionado = fechaSeleccionada;
    console.log('Tareas obtenidas para el día', fechaSeleccionada, this.tareasDelDia);

  }

  async alSeleccionarDiaSemana(dia: Date) {
    const fecha = dia.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    this.diaSeleccionado = fecha;
    if (!this.curso) return;

    // Cargar tareas para el día de la semana seleccionado
    await this.cargarTareasDelDia(fecha);
    console.log('Tareas obtenidas para el día', fecha, this.tareasDelDia);
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
  closeModal(modal: IonModal) {
      if (modal) {
        modal.dismiss();
      }
    }
  async abrirCamara(tarea: any){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });
    this.selectedPhoto = `data:image/jpeg;base64,${image.base64String}`;
    if (this.selectedPhoto) {
      // Si se ha seleccionado una foto, subimos la imagen
      const filePath = await this.subirImagen(this.selectedPhoto);
      if (filePath) {
        this.selectedPhoto = `https://xihoqjtqwissymcnjrud.supabase.co/storage/v1/object/public/fotos/${filePath}`;
        this.supabase.subirFotoTarea(this.id, tarea.id,true,this.selectedPhoto)
      }

    }

  }
  async subirImagen(base64String: string): Promise<string | null> {
    const filePath = `assets/imgAlumnos/${Date.now()}.png`; // Nombre único basado en timestamp
    const file = this.base64StringToFile(base64String, filePath);

    const { data, error } = await this.supabase.subirArchivo('fotos', filePath, file);

    if (error) {
      console.error('Error subiendo la imagen:', error);
      return null;
    }

    console.log('Imagen subida con éxito:', data);
    return filePath; // Devuelve la ruta del archivo en el bucket
  }
  base64StringToFile(base64: string, filename: string): File {
    // Elimina el prefijo 'data:image/jpeg;base64,' o cualquier otro tipo
    const base64String = base64.split(',')[1];  // Extrae solo la parte Base64

    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const byteSlice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(byteSlice.length);

      for (let i = 0; i < byteSlice.length; i++) {
        byteNumbers[i] = byteSlice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new File(byteArrays, filename, { type: 'image/png' }); // ✅ Asegurar el return
  }




}
