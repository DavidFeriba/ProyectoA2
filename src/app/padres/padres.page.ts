import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alumno } from 'src/models/alumno.interface';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
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
  tutor_uid:number = 0

  
  today: string;
  public alumnos: Alumno[] = [];
  public selectedPhoto: string = ''; // Almacena la imagen seleccionada


  constructor(private supabaseService: SupabaseService,private alertController: AlertController, private router:Router) {
    this.today = new Date().toISOString().split("T")[0];
  }
  
 
  
  async ngOnInit() {
    this.alumnos = (await this.supabaseService.obtenerAlumnosDelTutor()) || [];
    this.supabaseService.getDatosTutor().then(tutor =>{
      if (tutor) {
        console.log(this.tutor_uid=tutor.uid)
      }else{
        console.log("Adios")
      }
    })
  
    
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
  



  

  async presentAlert(initialData: any={}) {
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
          type: 'number',
          placeholder: 'Curso',
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
        await this.supabaseService.addAlumno(nombre, apellidos, curso, foto, tutor.id);
    
        console.log('Alumno registrado con éxito');
      } catch (error) {
        console.error('Error al registrar el alumno:');
      }

  }
 

}
