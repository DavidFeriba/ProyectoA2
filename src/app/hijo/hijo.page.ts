import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { Chart, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-hijo',
  templateUrl: './hijo.page.html',
  styleUrls: ['./hijo.page.scss'],
  standalone: false,
})
export class HijoPage implements OnInit, AfterViewInit {
  @ViewChild('myChart') myChartRef!: ElementRef;
  presentingElement!: HTMLElement | null;
  id: string = '';
  alumno: any = null;
  avisos: any[] = [];
  chart: any; // Guardar la instancia del gráfico
  chartType: ChartType = 'line'; // Tipo de gráfico inicial

  constructor(private route: ActivatedRoute, private supabase: SupabaseService) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  async ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    this.alumno = await this.supabase.obtenerAlumno(this.id);
    this.avisos = await this.supabase.obtenerAvisosDeAlumno(this.id)
  }

  ngAfterViewInit() {
    this.crearGrafico(); // Inicializar el gráfico cuando la vista esté lista
  }

  // Función para crear el gráfico
  async crearGrafico() {
    const ctx = this.myChartRef.nativeElement.getContext('2d');
    const tareasPorDia = await this.supabase.obtenerTareasPorDia(this.id);

    this.chart = new Chart(ctx, {
      type: this.chartType, // Usar el tipo de gráfico actual
      data: {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [
          {
            label: 'Deberes entregados X día',
            data: tareasPorDia,
            backgroundColor: ['#f44336', '#2196f3', '#ffeb3b', '#8bc34a', '#ff5722', '#673ab7', '#c2185b'],
            borderColor: ['#c62828', '#1565c0', '#fbc02d', '#388e3c', '#e64a19', '#5e35b1', '#ad1457'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
      },
    });
  }

  // Función para cambiar el tipo de gráfico
  cambiarTipoGrafico() {
    this.chart.destroy(); // Eliminar el gráfico actual
    this.crearGrafico(); // Crear un nuevo gráfico con el nuevo tipo
  }
}
