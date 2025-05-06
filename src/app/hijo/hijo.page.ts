import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-hijo',
  templateUrl: './hijo.page.html',
  styleUrls: ['./hijo.page.scss'],
  standalone : false
})
export class HijoPage implements OnInit {
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

}
