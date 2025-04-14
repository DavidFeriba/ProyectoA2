import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hijo',
  templateUrl: './hijo.page.html',
  styleUrls: ['./hijo.page.scss'],
  standalone : false
})
export class HijoPage implements OnInit {
  id: number = 0;
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    })
   }

  ngOnInit() {
  }

}
