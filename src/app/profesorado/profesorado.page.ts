import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { Alumno } from 'src/models/alumno.interface';

@Component({
  selector: 'app-profesorado',
  templateUrl: './profesorado.page.html',
  styleUrls: ['./profesorado.page.scss'],
  standalone: false
})
export class ProfesoradoPage implements OnInit {
  today: string;
  public alumnos:Alumno[] = [];
  public alertButtons = [
    {
      text: 'OK',
      handler: () => {
        console.log('Se presionó OK');
        this.addAlumno();
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
  
    constructor(private router:ActivatedRoute, private router2:Router) {
      this.today = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
     }
     closeModal(modal: IonModal) {
      if (modal) {
        modal.dismiss();
      }
    }
    addAlumno() {
      console.log(this.alertInputs[0])
      // Aquí puedes realizar cualquier acción que necesites
    }
    



  ngOnInit() {
  }

}
