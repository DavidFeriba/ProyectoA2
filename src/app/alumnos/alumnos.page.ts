import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';


@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.page.html',
  styleUrls: ['./alumnos.page.scss'],
  standalone: false
})
export class AlumnosPage implements OnInit {
  vistaSeleccionada:string ='semana'
  today: string;
  diasSemana: Date[] = [];
  id : string = ''


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

  constructor(private router:ActivatedRoute, private router2:Router, private supabase:SupabaseService) {
    this.today = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
    this.router.params.subscribe(params => {
      this.id = params['id'];
    })
   }


   ngOnInit() {
    this.generarDiasSemana()
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
}
