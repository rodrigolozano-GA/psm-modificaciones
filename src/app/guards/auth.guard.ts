import { Injectable, Output, EventEmitter, Input } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GeneralService } from '../servicios/general/general.service';
import { LoginComponent } from '../componentes/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  routes: any;

  constructor(public route: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
  {
    if(localStorage['SessionConAct'] !=null && localStorage['SessionConAct']!=undefined && localStorage['SessionConAct']!='')
    {
      return true;
    }
    else
    {
      return false;
    }
    
  }
}
