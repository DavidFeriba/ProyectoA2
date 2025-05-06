import {  OnInit } from '@angular/core';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../services/supabase.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-hijo',
  templateUrl: './hijo.page.html',
  styleUrls: ['./hijo.page.scss'],
  standalone : false
})
export class HijoPage implements OnInit {
  @ViewChild('myChart') myChartRef!: ElementRef;
  id: string = '';
  alumno: any = null;
  constructor(private route: ActivatedRoute, private supabase: SupabaseService) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    })
   }

  async ngOnInit() {
    this.alumno = await this.supabase.obtenerAlumno(this.id);
  }
  ngAfterViewInit() {
    console.log(this.myChartRef);
    const ctx = this.myChartRef.nativeElement.getContext('2d');

    new Chart(ctx, {
      type: 'line', // o 'line', 'pie', etc.
      data: {
        labels: ['Lunes', 'Martes', 'Miercoles','Jueves','Viernes','Sabado','Domingo'],
        datasets: [
          {
            label: 'Deberes entregados X día',
            data: [12, 19, 3],
            backgroundColor: ['#f44336', '#2196f3', '#ffeb3b'],
            borderColor: ['#c62828', '#1565c0', '#fbc02d'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

}
