import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cargando',
  templateUrl: './cargando.page.html',
  styleUrls: ['./cargando.page.scss'],
  standalone: false
})
export class CargandoPage implements OnInit {
  rutaDestino: string = '';

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.rutaDestino = this.route.snapshot.queryParamMap.get('ruta') || '/home'; // ruta por defecto
    setTimeout(() => {
      this.router.navigateByUrl(this.rutaDestino);
    }, 2000);
  }

}
