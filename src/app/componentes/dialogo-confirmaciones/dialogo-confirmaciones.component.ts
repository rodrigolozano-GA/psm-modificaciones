import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-dialogo-confirmaciones',
  templateUrl: './dialogo-confirmaciones.component.html',
  styleUrls: ['./dialogo-confirmaciones.component.scss']
})
export class DialogoConfirmacionesComponent implements OnInit {

  title: string = "";
  text: string = "";
  cancelAction: string = "";
  okAction: string = "";
  constructor(public _dialogRef: MatDialogRef<DialogoConfirmacionesComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = this.data.title;
    this.text = this.data.text;
    this.cancelAction = this.data.cancelAction;
    this.okAction = this.data.okAction;
  }

  ngOnInit() {
  }

  cancelar = () => {
    this._dialogRef.close(false);
  }

  aceptar = () => {
    this._dialogRef.close(true);
  }

}
