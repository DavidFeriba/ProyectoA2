import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ToastController } from '@ionic/angular';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-anadir-hijo',
  templateUrl: './anadir-hijo.page.html',
  styleUrls: ['./anadir-hijo.page.scss'],
  standalone : false
})
export class AnadirHijoPage implements OnInit {



  ngOnInit() {
  }
   nombre = '';
  apellidos = '';
  curso = '';
  selectedPhoto: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async seleccionarFoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });
    this.selectedPhoto = `data:image/jpeg;base64,${image.base64String}`;
  }

  async guardar() {
    const regex = /^[1-6][A-Z]$/;
    if (!regex.test(this.curso)) {
      const toast = await this.toastController.create({
        message: "Formato de curso inválido. Usa algo como 1A, 2B, etc.",
        duration: 3000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    let pin: number;
    do {
      pin = Math.floor(10000 + Math.random() * 90000);
    } while (!this.supabaseService.pinExiste(pin));

    const tutor = await this.supabaseService.getDatosTutor();
    if (!tutor) return;

    let fotoUrl = 'assets/default-avatar.png';
    if (this.selectedPhoto) {
      const filePath = `assets/imgAlumnos/${Date.now()}.png`;
      const file = this.base64StringToFile(this.selectedPhoto, filePath);
      const { data, error } = await this.supabaseService.subirArchivo('fotos', filePath, file);
      if (!error) {
        fotoUrl = `https://xihoqjtqwissymcnjrud.supabase.co/storage/v1/object/public/fotos/${filePath}`;
      }
    }

    await this.supabaseService.addAlumno(this.nombre, this.apellidos, this.curso, fotoUrl, tutor.id, pin);
    this.router.navigate(['/padres']);
  }

  base64StringToFile(base64: string, filename: string): File {
    const base64String = base64.split(',')[1];
    const byteCharacters = atob(base64String);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = Array.from(slice).map(char => char.charCodeAt(0));
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    return new File(byteArrays, filename, { type: 'image/png' });
  }

}
