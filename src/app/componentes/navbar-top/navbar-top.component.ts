import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable, from } from 'rxjs';
import { SessionValidateUtilService } from 'src/app/util/session-validate-util.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar-top',
  templateUrl: './navbar-top.component.html',
  styleUrls: ['./navbar-top.component.scss']
})
export class NavbarTopComponent implements OnInit {

  @Output() eventLogOut = new EventEmitter<any>();
  @Output() eventToggle = new EventEmitter<any>();

  public username : Observable<String>;
  public name: string;
 

  constructor(private sessionValidate: SessionValidateUtilService,private route: Router) { }

  ngOnInit() 
  {
    this.username = this.sessionValidate.showUser;
    this.username.subscribe(ars => {
      if(ars != 'Usuario')
      {
        this.name = ars.substring(0,ars.indexOf(' '));
      } }) 
  }

  eLogOut = () => {
      this.eventLogOut.emit(true);
  }

  toggleSidenav = () => {
    this.eventToggle.emit(true);
  }

  go = () => {
    this.route.navigate(['/Soporte']);
  }

}
