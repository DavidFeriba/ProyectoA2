import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alumno } from 'src/models/alumno.interface';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, ToastController } from '@ionic/angular';
import { SupabaseService } from '../services/supabase.service';
import { Tutor } from 'src/models/tutor.interface';





@Component({
  selector: 'app-padres',
  templateUrl: './padres.page.html',
  styleUrls: ['./padres.page.scss'],
  standalone: false
})
export class PadresPage implements OnInit {
  tutor_nombre: string =''
  tutor_apellidos:string=''
  tutor_rol:string=''
  tutor_uid:string = ''
  tutor_vinculado_id: number= -1

  cargando: boolean = true;



  public alumnos: Alumno[] = [];
  public selectedPhoto: string = ''; // Almacena la imagen seleccionada


  constructor(private toastController: ToastController,private supabaseService: SupabaseService,private alertController: AlertController, private router:Router) {
  }



  async ngOnInit() {

    const tutor = await this.supabaseService.getDatosTutor();

    if (tutor) {
      this.tutor_uid = tutor.uid;
      this.tutor_nombre = tutor.nombre;
      this.tutor_vinculado_id = tutor.vinculado_id;
      console.log(this.tutor_uid);
      const alumnosPropios = await this.supabaseService.obtenerAlumnosDelTutor(this.tutor_uid) || [];
      const alumnosVinculado = await this.supabaseService.obtenerAlumnosDelTutor(this.tutor_vinculado_id);
      this.alumnos = alumnosPropios.concat(alumnosVinculado)
      setTimeout(() => {
        this.cargando = false; // Aplica fade-out

        // Después de que termine la animación, quitamos del DOM
        setTimeout(() => {
          this.cargando = false;
        }, 1000); // Tiempo igual al de la animación
      }, 2000);



    } else {
      console.log("Adios");
    }


  }

  async subirImagen(base64String: string): Promise<string | null> {
    const filePath = `assets/imgAlumnos/${Date.now()}.png`; // Nombre único basado en timestamp
    const file = this.base64StringToFile(base64String, filePath);

    const { data, error } = await this.supabaseService.subirArchivo('fotos', filePath, file);

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
  async vincularAlert(){
    if (this.tutor_vinculado_id <= 0) {
      const alert = await this.alertController.create({
        header: 'Vinculación de otro usuario para compartir los hijos',
        inputs: [
          {
            name: "correo",
            type: "text",
            placeholder: 'Correo electrónico de tu compañero',
          },
        ],

        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {

            text:'Enviar petición',
            handler: async (data) => {
              const correo: string = data.correo
             const errorYaVinculado = await this.supabaseService.vincularTutores(this.tutor_uid, correo)
             if (errorYaVinculado){
              this.yaVinculadoToast()
             }else{
              const tutor = await this.supabaseService.getDatosTutor();
              this.tutor_vinculado_id = tutor.vinculado_id
             }
            },
          },
        ]
      }

    )
    await alert.present()
    }else{
      const alert = await this.alertController.create({
        header: 'Ya tienes a tu compañero vinculado',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {

            text:'Eliminar vínculo',
            handler: () => {
              this.supabaseService.eliminarVinculo(this.tutor_uid,this.tutor_vinculado_id)
              this.tutor_vinculado_id = -1
            },
          },
        ]
      }
    )
    await alert.present()
    }





  }





  async anadirAlert(initialData: any={}) {
    const imageSrc = this.selectedPhoto || '../assets/default-avatar.png';
  const imageHtml = `<img src="${imageSrc}" alt="Foto" style="max-width: 100%; height: auto; margin: 10px auto; display: block; border-radius: 5px;" />`;
    const alert = await this.alertController.create({
      header: 'Ingrese la información del hijo',
      message: imageHtml,
      inputs: [
        {
          name: "nombre",
          type: "text",
          placeholder: 'Nombre',
          value: initialData.nombre ||''
        },
        {
          name: "apellidos",
          type: "text",
          placeholder: 'Apellidos',
          value: initialData.apellidos || ''
        },
        {
          name: "curso",
          type: 'text',
          placeholder: 'Curso: 1B, 2A...',
          min: 1,
          max: 6,
          value: initialData.curso ||''
        },
        {
          name: "foto",
          type: 'text',
          placeholder: 'Foto',
          value: this.selectedPhoto ? 'Foto seleccionada' : 'Foto no seleccionada',
          disabled:true // Aquí se guarda la foto seleccionada
        }
      ],

      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'OK',
          handler: async (data: any) => {
            // Lógica para subir la imagen cuando se hace clic en "OK"
          if (this.selectedPhoto) {
            // Si se ha seleccionado una foto, subimos la imagen
            const filePath = await this.subirImagen(this.selectedPhoto);
            if (filePath) {
              this.selectedPhoto = `https://xihoqjtqwissymcnjrud.supabase.co/storage/v1/object/public/fotos/${filePath}`;
            }
          }

          // Aquí agregamos el alumno con la foto que se subió (o la predeterminada)
          await this.addAlumno({
            ...data,
            foto: this.selectedPhoto || 'assets/default-avatar.png'
          });

          }
        },
        {
          text: 'Seleccionar foto',
          handler: async () => {
            const currentValues = {
              nombre: alert.inputs[0].value,
              apellidos: alert.inputs[1].value,
              curso: alert.inputs[2].value
            };

            // Selecciona la foto sin cerrar el alert
            const image = await Camera.getPhoto({
              quality: 90,
              allowEditing: false,
              resultType: CameraResultType.Base64,
              source: CameraSource.Photos
            });

            // Actualiza la foto
            this.selectedPhoto = `data:image/jpeg;base64,${image.base64String}`;
            const alertElement = await this.alertController.getTop();
          if (alertElement) {
            const shadowRoot = alertElement.shadowRoot || alertElement;
            const imgElement = shadowRoot.querySelector('img');

            if (imgElement instanceof HTMLImageElement) {
              imgElement.src = this.selectedPhoto;
            }
          }


            alert.inputs[0].value = currentValues.nombre;
            alert.inputs[1].value = currentValues.apellidos;
            alert.inputs[2].value = currentValues.curso;

            return false;
          }
        }
      ]
    });

    await alert.present();
  }

  async addAlumno(data: any) {
    let pin :number = 0
    const regex = /^[1-6][A-Z]$/;
    if (!regex.test(data.curso)) {
      await this.malRegexToast();
      return; // Detiene la función si el formato no es válido
    }
    do {
      pin = Math.floor(10000 + Math.random() * 90000);
    } while (!this.supabaseService.pinExiste(pin));
      console.log(pin);
      console.log("DATOS: ")
      const nombre: string = data.nombre
      const apellidos: string = data.apellidos
      const foto: string = this.selectedPhoto || 'assets/default-avatar.png'
      const curso : string = data.curso
      try {
        // Primero obtenemos el tutor
        const tutor = await this.supabaseService.getDatosTutor();

        // Verificar que el tutor existe
        if (!tutor) {
          throw new Error('Tutor no encontrado');
        }

        // Pasamos el id del tutor a la función addAlumno
        await this.supabaseService.addAlumno(nombre, apellidos, curso, foto, tutor.id,pin);

        console.log('Alumno registrado con éxito');
      } catch (error) {
        console.error('Error al registrar el alumno:');
      }
      this.ngOnInit()

  }
  async yaVinculadoToast() {
    const toast = await this.toastController.create({
      message: 'Este tutor ya está vinculado',
      duration: 3000,
      color: 'danger',
      position: 'bottom',
    });
    await toast.present();
  }

  cerrarSesion(){
    this.alumnos=[]
    this.supabaseService.cerrarSesion()
    this.router.navigate(['/home'])
  }

  async malRegexToast(){
    const toast = await this.toastController.create({
      message: "Formato de curso inválido. Debe ser algo como 1A, 3B, etc.'",
      duration: 3000,
      color: 'danger',
      position: 'top'
    });
    toast.present();

  }



}
