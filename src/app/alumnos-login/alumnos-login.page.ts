import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-alumnos-login',
  templateUrl: './alumnos-login.page.html',
  styleUrls: ['./alumnos-login.page.scss'],
  standalone : false
})
export class AlumnosLoginPage implements OnInit {
  pin!: number;
  errorLogin: boolean = false;
  constructor(private router:ActivatedRoute, private router2:Router, private supabase:SupabaseService) { }
  async login() {
    try{
    const alumno = await this.supabase.confirmarPin(this.pin)
    if (alumno){
      this.router2.navigate(['/alumnos', alumno.id])
    }else{
      this.errorLogin = true
    }
  }catch (error){
    this.errorLogin = true
  }
}
  ngOnInit() {
  }

}
