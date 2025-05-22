import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { Chart, ChartType, registerables } from 'chart.js';
import { AlertController } from '@ionic/angular';

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

  constructor(private alertController: AlertController, private route: ActivatedRoute, private router: Router, private supabase: SupabaseService) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  async ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    this.alumno = await this.supabase.obtenerAlumno(this.id);
    this.avisos = await this.supabase.obtenerAvisosDeAlumno(this.id)
    console.log(this.alumno.pin)
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
        labels: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
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
  cambiandoGrafico: boolean = false;
  // Función para cambiar el tipo de gráfico
  async cambiarTipoGrafico() {
    this.cambiandoGrafico = true;

    // Destruye y vuelve a crear el gráfico
    if (this.chart) {
      this.chart.destroy();
    }

    // Asegura que se haya cambiado el tipo antes de crear el nuevo
    await new Promise(resolve => setTimeout(resolve, 50)); // pequeño retraso opcional

    this.crearGrafico();

    // Espera un momento para que el gráfico se renderice antes de volver a habilitar todo
    setTimeout(() => {

      this.cambiandoGrafico = false;


    }, 300);
  }
  @ViewChild('modal', { static: true }) modal!: HTMLIonModalElement;

  abrirModal() {
    if (this.cambiandoGrafico) return;
    this.modal.present();
  }

  async confirmarEliminacion() {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: 'Introduce el PIN del alumno para confirmar.',
      inputs: [
        {
          name: 'pin',
          type: 'password',
          placeholder: 'PIN'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: (data) => {
            if (data.pin == this.alumno?.pin) {
              this.eliminarAlumno(); // Aquí llamas a la lógica real de eliminación
            } else {
              this.mostrarErrorPin();
            }
          }
        }
      ]
    });

    await alert.present();
  }
  async mostrarErrorPin() {
    const errorAlert = await this.alertController.create({
      header: 'Error',
      message: 'El PIN introducido es incorrecto.',
      buttons: ['Aceptar']
    });
    await errorAlert.present();
  }
  async eliminarAlumno() {
  await this.supabase.eliminarAlumno(this.id)
  this.router.navigate(['/home'])
  }
}
