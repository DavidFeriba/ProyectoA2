import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
  standalone : false
})
export class RegistrarPage implements OnInit {

  constructor(private router:ActivatedRoute) { }

  ngOnInit() {
  }

}
