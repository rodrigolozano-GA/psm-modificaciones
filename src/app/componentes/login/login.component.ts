import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';

// Clases
import { Login } from '../../clases/Login/Login';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { Router } from '@angular/router';
import { error } from 'protractor';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger("inOut", [
      state("in", style({
        opacity: '1'
      })),
      state("out", style({
        opacity: '0'
      })),
      transition('in => out', [
        animate("2s")
      ]),
      transition('out => in', [
        animate("2s")
      ])
    ])
  ]
})

export class LoginComponent implements OnInit {

  // Clase para la validación del login
  User: Login = new Login(0, "");

  Name: string = "";
  Pass: string = "";
  loading: boolean = false;
  
  @Output() eventLogin = new EventEmitter<any>();

  constructor(private _snack: MatSnackBar,private _service:GeneralService, public route: Router) {}

  ngOnInit() {}

  validarUsuario = () => {
    if (this.User.nombre.length > 0) 
    {
     this.validateEmail();
    } 
    else 
    {
      this.showSnack("Ingrese un Usuario");
    }
  }

  validateEmail = () => {
    let ban = true;
    if(this.User.nombre.indexOf('@') == -1)
    {
      this.User.nombre +='@grupoarmstrong.com';
    }
    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.User.nombre))
    {
      let ini = (this.User.nombre).indexOf('@');
      let end = (this.User.nombre).length;
      let sub = ((this.User.nombre).substring(ini,end)).toLowerCase();
      if(sub == '@grupoarmstrong.com')
      {
        this.post('login/control/valida',this.User.nombre);
      }
      else
      {
        ban = false;
      }
     }
    else
    {
      ban = false;
    }
    if(!ban)
    {
      this._snack.open("Ingrese un usuario válido [  Usuario@grupoarmstrong  |  Usuario  ]", "",
      {
        duration: 6000,
        panelClass: ["snack-warning"]
      });
    
    }
  }

  validarPass = () => {
    /* Validar si se capturó la contraseña */
    if (this.Pass.length) {
      this.validatePsw(this.User.nombre,this.Pass);
    } else {
      this.showSnack("Ingrese la contraseña");
    }
  }

  regresar = () => {
    this.User = new Login(0, "");
    this.Name = ""
    this.Pass = "";
  }

  eLogin = () => {
    this.eventLogin.emit(true);
  }

  //Validar Usuario
  post = (url:string, correo :string) : any => {

    let param = { Correo :  correo}
    this._service.postData(url,'',param)
    .subscribe(
      data => {
         if((data['DATA'])[0].id !=0)
         {
           this.loading = true;
           setTimeout(() => {
              this.User.id = (data['DATA'])[0].id;
              this.loading = false;
            }, 2000);

         }
         else
         {
          this.loading = true;
          setTimeout(() => {
            this.User.id = 0;
            this.loading = false;
            this.showSnack("Acceso denegado");
          }, 2000);
         }
        }
    )
  }

  validatePsw = (nombre: string, pwd: string) => {
    let param = {Correo : nombre, Pwd:pwd};
    this._service.postData('login/control/validapwd','',param)
    .subscribe(
      data => {
        if(data["SUCCESS"] == 1)
        {
          if((data["DATA"]).length)
          {
            this.makeLogin(data["DATA"]);
          }
          else
          {
            this.showSnack("Acceso denegado");

          }
        }
        
      }
      ,error =>{ 
        this.showSnack("Acceso denegado");
      }
    );

  }

  makeLogin = (datos :any) => {
 
    let param = { id: datos[0].id, nombre: (datos[0].nombre)};
    this._service.postData('login/control/obtMenus','',param)
    .subscribe( 
      data => {
        if(data['SUCCESS'] == 1)
        {
          this.eLogin();
          let token = {
            IdUsuario : (data["DATA"])['IdUsuario'],
            Nombre    : (data["DATA"])['NombreUsuario']
            }
            
          localStorage['Menus'] = JSON.stringify((data['DATA'])['Menus']);
          localStorage['SessionConAct'] = JSON.stringify(token);
         // console.log("datos de sesion = " ,  localStorage['SessionConAct']  );
          this.route.navigate(['/Home']);
        }
       else
       {
          this.showSnack("El usuario no existe!");
        } 
      }
      );
  }
 
  showSnack = (msj: string) =>{
    this._snack.open(msj, "", {
      duration: 2000,
      panelClass: ["snack-error"]
  })
  }

}
