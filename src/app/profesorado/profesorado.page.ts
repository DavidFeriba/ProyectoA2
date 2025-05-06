import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal, ModalController } from '@ionic/angular';
import { Alumno } from 'src/models/alumno.interface';
import { SupabaseService } from '../services/supabase.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profesorado',
  templateUrl: './profesorado.page.html',
  styleUrls: ['./profesorado.page.scss'],
  standalone: false
})
export class ProfesoradoPage implements OnInit {
  message = 'This modal example uses the modalController to present and dismiss modals.';

  today: string;
  avisos: any[] = []
  profesor_uid: string = '';
  profesor_id:string = ''
  asignaturas: string[]= []
  cursos: string[] = []
  public alumnos:any[] = [];
  public alumnosFiltrados: any[] = [];
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


    constructor( private alertController: AlertController, private supabase: SupabaseService,private router:ActivatedRoute, private router2:Router) {
      this.today = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
     }
     closeModal(modal: IonModal) {
      if (modal) {
        modal.dismiss();
      }
    }
    async addAviso() {
      const alertAlumnos = await this.alertController.create({
        header: 'Selecciona un alumno',
        inputs: this.alumnos.map((alumno, index) => ({
          type: 'radio' as const,
          label: `${alumno.nombre} ${alumno.apellidos}`,
          value: alumno.id,
          checked: index === 0
        })),
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Siguiente',
            handler: (id_alumno) => {
              this.preguntarAviso(id_alumno);
            }
          }
        ]
      });

      await alertAlumnos.present();
    }
    async preguntarAviso(id_alumno: string) {
      const alertAviso = await this.alertController.create({
        header: 'Nuevo Aviso',
        inputs: [
          {
            name: 'mensaje',
            type: 'textarea',
            placeholder: 'Escribe el mensaje'
          },
          {
            name: 'grado',
            type: 'radio',
            label: 'Leve',
            value: 0,
            checked: true
          },
          {
            name: 'grado',
            type: 'radio',
            label: 'Moderado',
            value: 1
          },
          {
            name: 'grado',
            type: 'radio',
            label: 'Grave',
            value: 2
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Crear',
            handler: (data) => {
              this.supabase.crearAviso(
                id_alumno,
                this.profesor_id,
                data.mensaje,
                data.grado
              ).then(() => {
                // opcional: toast o recarga de lista
              }).catch((error) => {
                console.error('Error al crear aviso:', error);
              });
            }
          }
        ]
      });

      await alertAviso.present();
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
      this.cargarAvisos();


    } else {
      console.log("Adios");
    }
  }
  async cargarAvisos() {
    try {
      this.avisos = await this.supabase.obtenerAvisos(this.profesor_id);
      console.log('Avisos:', this.avisos);
    } catch (error) {
      console.error('Error al cargar los avisos:', error);
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
  cerrarSesion(){
    this.alumnos=[]
    this.supabase.cerrarSesion()
    this.router2.navigate(['/home'])
  }
  async formularioAviso(alumno: any) {
    const alertGrado = await this.alertController.create({
      header: `Grado del aviso para ${alumno.nombre}`,
      inputs: [
        { name: 'gravedad', type: 'radio', label: 'Leve', value: '1', checked: true },
        { type: 'radio', label: 'Intermedio', value: '2' },
        { type: 'radio', label: 'Grave', value: '3' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Siguiente',
          handler: async (dataGrado) => {
            const alertMensaje = await this.alertController.create({
              header: 'Escribe el mensaje del aviso',
              inputs: [
                {
                  type: 'text',
                  name: 'mensaje',  // Cambié 'mensaje' a un nombre distinto
                  placeholder: 'Escribe el mensaje aquí...',
                  attributes: { maxlength: 255 }
                }
              ],
              buttons: [
                { text: 'Cancelar', role: 'cancel' },
                {
                  text: 'Enviar',
                  handler: async (dataMensaje) => {
                    try {
                      // Convertir 'dataGrado' a número antes de pasarlo al servicio
                      const gradoNumber = parseInt(dataGrado, 10); // Ahora es un número
                      if (isNaN(gradoNumber)) {
                        console.error('El grado seleccionado no es válido');
                        return;
                      }
  
                      await this.supabase.crearAviso(
                        alumno.id,
                        this.profesor_id,

                        dataMensaje.mensaje,
                        gradoNumber
                      );
                      console.log('Aviso creado correctamente');
                      this.cargarAvisos();
                    } catch (err) {
                      console.error('Error al crear el aviso:', err);
                    }
                  }
                }
              ]
            });
  
            await alertMensaje.present();
          }
        }
      ]
    });
  
    await alertGrado.present();
  }
  
  
  @ViewChild('escogerAlumno', { static: false }) modalEscogerAlumno: any;
  @ViewChild('modalAnadirAviso', { static: false }) modalAnadirAviso?: IonModal;
@ViewChild('modalAvisos', { static: false }) modalAvisos?: IonModal;

abrirModalAlumno(curso: string) {
  this.cursoSeleccionado = curso;
  this.alumnosFiltrados = this.alumnos.filter(alumno => alumno.curso === curso);
  this.modalEscogerAlumno.present();
}
comprobarTarea(alumno: any){
  this.router2.navigate(['/revisar-tareas'], {
    queryParams: { idAlumno: alumno.id, idProfesor: this.profesor_id }
  });
}
verTareasDeTodos() {
  this.router2.navigate(['/revisar-tareas'], {
    queryParams: { idProfesor: this.profesor_id,
      curso: this.cursoSeleccionado
     }
  });
}
async abrirModalAnadirAviso() {
  await this.modalAvisos?.dismiss(); // Opcional: cierra el modal anterior si lo deseas
  await this.modalAnadirAviso?.present();
}
async borrarAviso(idAviso: number) {
  try {
    await this.supabase.borrarAviso(idAviso);
    this.cargarAvisos(); // vuelve a cargar los avisos desde Supabase
  } catch (error) {
    console.error('No se pudo borrar el aviso:', error);
  }
}
}
