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

  constructor(private supabaseService: SupabaseService,private alertController: AlertController) {
    this.today = new Date().toISOString().split("T")[0];
  }
  async ngOnInit() {
    this.alumnos = (await this.supabaseService.obtenerUsuarios()) || [];
    console.log('Usuarios:', this.alumnos);
  }

  async selectPhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });

    this.selectedPhoto = `data:image/jpeg;base64,${image.base64String}`;
    console.log('Foto seleccionada:', this.selectedPhoto);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Ingrese la información del hijo',
      inputs: [
        {
          name: "nombre",
          type: "text",
          placeholder: 'Nombre',
        },
        {
          name: "apellidos",
          type: "text",
          placeholder: 'Apellidos',
        },
        {
          name: "curso",
          type: 'number',
          placeholder: 'Curso',
          min: 1,
          max: 6,
        },
        {
          name: "foto",
          type: 'text',
          placeholder: 'Foto',
          value: this.selectedPhoto, // Aquí se guarda la foto seleccionada
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
          handler: () => {
            this.selectPhoto();  // Llamamos a la función para seleccionar la foto
          }
        }
      ]
    });

    await alert.present();
  }

  async addAlumno(data: any) {
    const nuevoAlumno: Alumno = {
      nombre: data.nombre,
      apellidos: data.apellidos,
      foto: this.selectedPhoto || 'assets/default-avatar.png', // Si no hay foto seleccionada, usamos una predeterminada
      curso: data.curso,
      notas: [],
      profesor: undefined,
      logros: [],
      avisos: []
    };
  }
}
