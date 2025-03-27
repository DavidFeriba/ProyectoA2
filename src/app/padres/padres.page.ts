import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alumno } from 'src/models/alumno.interface';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { SupabaseService } from '../services/supabase.service';





@Component({
  selector: 'app-padres',
  templateUrl: './padres.page.html',
  styleUrls: ['./padres.page.scss'],
  standalone: false
})
export class PadresPage implements OnInit {
  
  today: string;
  public alumnos: Alumno[] = [];
  public selectedPhoto: string = ''; // Almacena la imagen seleccionada
  supabase: any;

  constructor(private supabaseService: SupabaseService,private alertController: AlertController) {
    this.today = new Date().toISOString().split("T")[0];
  }
  async ngOnInit() {
    this.alumnos = (await this.supabaseService.obtenerUsuarios()) || [];
    console.log('Usuarios:', this.alumnos);
  }


    
    /**if (image.base64String) {
      const filePath = `imgAlumnos/${Date.now()}.png`; // Nombre único basado en el timestamp
      const file = this.base64StringToFile(image.base64String, filePath);
  
      const { data, error } = await this.supabase.storage
        .from('imgAlumnos') // Asegúrate de tener un "bucket" llamado 'avatars'
        .upload(filePath, file, { upsert: true });
  
      if (error) {
        console.error('Error subiendo la imagen:', error);
      } else {
        console.log('Imagen subida con éxito:', data);
        this.selectedPhoto = data.Key; // Guardamos la clave del archivo en el estado
      }
    }
  }

  base64StringToFile(base64: string, filename: string): File {
    const byteCharacters = atob(base64);
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

    return new File(byteArrays, filename, { type: 'image/png' });*/
  

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
          handler: (data: any) => {
            this.addAlumno(data);
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
            
            // Actualiza la imagen en el alert directamente
            const alertElement = await this.alertController.getTop();
            if (alertElement) {
              const shadowRoot = alertElement.shadowRoot || alertElement;
              const imgElement = shadowRoot.querySelector('img');
              
              if (imgElement instanceof HTMLImageElement) {
                imgElement.src = this.selectedPhoto;
              }
            }
            // Restaura los valores
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

  
    await this.supabaseService.addAlumno(nombre, apellidos, curso, foto);

  }

}
