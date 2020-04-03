import { Component, OnInit } from '@angular/core';
import { SessionValidateUtilService } from 'src/app/util/session-validate-util.service';
import { Observable, from } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private sessionValidate: SessionValidateUtilService) { 
    this.sessionValidate.validateSession();
    this.sessionValidate.makeUser();
  }

  public username : Observable<String>;
  public name: String;

  ngOnInit() {
    this.username = this.sessionValidate.showUser;
    this.username.subscribe(ars => {
      if(ars != 'Usuario')
      {
        this.name = ars;
      } }) 
   }

}
