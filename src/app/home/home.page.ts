import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(private router:Router, private supabase:SupabaseService) {}

  async login(){
    const { data } = await this.supabase.auth.getSession();
    const session = data.session;
    if (session){
      this.router.navigate(['/padres'])
    }else{
      this.router.navigate(['/login'])
    }
  }

}
