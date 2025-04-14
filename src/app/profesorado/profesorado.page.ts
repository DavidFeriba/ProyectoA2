import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal, ModalController } from '@ionic/angular';
import { Alumno } from 'src/models/alumno.interface';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-profesorado',
  templateUrl: './profesorado.page.html',
  styleUrls: ['./profesorado.page.scss'],
  standalone: false
})
export class ProfesoradoPage implements OnInit {
  message = 'This modal example uses the modalController to present and dismiss modals.';

  today: string;
  profesor_uid: string = '';
  profesor_id:string = ''
  asignaturas: string[]= []
  cursos: string[] = []
  public alumnos:Alumno[] = [];
  tareas:any[] = []
  public tareaAlertInputs: any[] = []
  asignaturaSeleccionada: string = ''
  cursoSeleccionado: string= ''

  public tareaAlertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        console.log('Cancelado');
      }
    },
    {
      text: 'Guardar',
      handler: (data: any) => {
        this.addTarea(data);
      }
    }
  ];
  public alertButtons = [
    {
      text: 'OK',
      handler: () => {
        console.log('Se presionó OK');
      }
    }
  ];
  public alertInputs = [
    {
      name: "nombre",
      placeholder: 'Nombre',
    },
    {
      name: "apellidos",
      placeholder: 'Apellidos',
    },
    {
      type: 'number',
      placeholder: 'clase',
      min: 1,
      max: 6,
    },
    {
      name:"foto",
      type: 'textarea',
      placeholder: 'Foto',
    },
  ];

    highlightedDates = [
      {
        date: '2025-03-05',
        textColor: '#800080',
        backgroundColor: '#ffc0cb',
      },
      {
        date: '2023-01-10',
        textColor: '#09721b',
        backgroundColor: '#c8e5d0',
      },
      {
        date: '2023-01-20',
        textColor: 'var(--ion-color-secondary-contrast)',
        backgroundColor: 'var(--ion-color-secondary)',
      },
      {
        date: '2023-01-23',
        textColor: 'rgb(68, 10, 184)',
        backgroundColor: 'rgb(211, 200, 229)',
      },
    ];


    constructor(private modalCtrl: ModalController, private supabase: SupabaseService,private router:ActivatedRoute, private router2:Router) {
      this.today = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
     }
     closeModal(modal: IonModal) {
      if (modal) {
        modal.dismiss();
      }
    }






  async ngOnInit() {
    const profesor = await this.supabase.getDatosProfesor();

    if (profesor) {
      this.profesor_uid = profesor.uid;
      this.alumnos = await this.supabase.obtenerAlumnosDelProfesor(this.profesor_uid) || [];
      console.log(this.alumnos)
      this.asignaturas = profesor.asignaturas || []
      this.cursos = profesor.cursos || []
      this.profesor_id = profesor.id
      this.tareas = await this.supabase.getTareasProfesor()


    } else {
      console.log("Adios");
    }
  }
  addTarea(data: any){
    this.supabase.anadirTarea(data);
  }
  async seleccionarAsignatura() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Selecciona una asignatura';
    alert.inputs = this.asignaturas.map((asignatura) => ({
      type: 'radio',
      label: asignatura,
      value: asignatura,
    }));

    alert.buttons = [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Siguiente',
        handler: (value: string) => {
          this.asignaturaSeleccionada = value;
          this.seleccionarCurso();
        }
      }
    ];

    document.body.appendChild(alert);
    await alert.present();
  }
  async seleccionarCurso() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Selecciona un curso';
    alert.inputs = this.cursos.map((curso) => ({
      type: 'radio',
      label: curso,
      value: curso,
    }));

    alert.buttons = [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Siguiente',
        handler: (value: string) => {
          this.cursoSeleccionado = value;
          this.abrirFormularioTarea();
        }
      }
    ];

    document.body.appendChild(alert);
    await alert.present();
  }
  async abrirFormularioTarea() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Datos de la tarea';
    alert.inputs = [
      {
        name: 'pagina',
        type: 'number',
        placeholder: 'Página'
      },
      {
        name: 'primeraActividad',
        type: 'text',
        placeholder: 'Actividad x...'
      },
      {
        name: 'ultimaActividad',
        type: 'text',
        placeholder: 'Hasta actividad y'
      },
      {
        name: 'f_limite',
        type: 'date',
        placeholder: 'Fecha límite'
      },
      {
        name: 'anotacion',
        type: 'textarea',
        placeholder: 'Anotación'
      }

    ];
    alert.buttons = [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Guardar',
        handler: (data: any) => {
          const tareaCompleta = {
            asignatura: this.asignaturaSeleccionada,
            curso: this.cursoSeleccionado,
            id: this.profesor_id,
            ...data
          };
          this.addTarea(tareaCompleta);
          this.ngOnInit()
        }
      }
    ];
    document.body.appendChild(alert);
    await alert.present();
  }
}
