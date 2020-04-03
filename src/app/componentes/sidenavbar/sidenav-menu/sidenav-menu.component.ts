import { Component, OnInit, Input, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-sidenav-menu',
  templateUrl: './sidenav-menu.component.html',
  styleUrls: ['./sidenav-menu.component.scss']
})
export class SidenavMenuComponent implements OnInit {
  tamano: number = 48;
  @ViewChild('section', { static: false }) secact;
  @ViewChild('listdp', { static: false }) list;
  @Input() tittle: string;
  @Input() child: [];
  @Input() icon: string;
  @Output() dactive = new EventEmitter<any>();
  @Input() mparent: MatSidenav;
  @Input() mwid: number;
  constructor() { }

  active: boolean = false;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.list.nativeElement.style.maxHeight = (this.child.length * this.tamano).toString().concat("px");
  }

  toggleLink = () => {
    this.active = !this.active;
    this.dactive.emit({ parent: this.secact.nativeElement, list: this.list.nativeElement });
  }

}
