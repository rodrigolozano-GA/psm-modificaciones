// core
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Clases
import { Login } from './clases/Login/Login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'psm-app';
  loged: boolean = false;
  screenWidth: number;

  constructor(private _router: Router) {
    this.screenWidth = window.innerWidth;

    window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth;
    });
  }

  // Validar el event.emiter
  getLogin = (event: any): void => {
    if (event) {
      this.loged = true;
    } else {
      this.loged = false;
    }
  }

  // Fin de la sesion 
  getLogOut = (event: any): void => {
    if(event)
    {
      this.loged = false;
      localStorage.clear();
      this._router.navigate(["/Login"]);
    }
    
    
  }
}
