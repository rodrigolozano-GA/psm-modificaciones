import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionValidateUtilService {

  private user = new BehaviorSubject<String>('Usuario');
  constructor(public route: Router) { }


  public validateSession()
  {
    if(localStorage['SessionConAct'] == '' && 
       localStorage['SessionConAct'] == null && 
       localStorage['SessionConAct'] == undefined)
    {
        this.route.navigate(['/Login']);
        return true;
    }
  }

  get showUser()
  {
    return this.user.asObservable();
  }

  makeUser()
  {
    if(localStorage.getItem('SessionConAct'))
    {
     let dataSession = JSON.parse(localStorage['SessionConAct'])
     this.user.next(dataSession.Nombre);
    }
  }

}
