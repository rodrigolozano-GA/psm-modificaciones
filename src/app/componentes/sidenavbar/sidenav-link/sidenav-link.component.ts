import { Component, OnInit, Input } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
    selector: 'app-sidenav-link',
    templateUrl: './sidenav-link.component.html',
    styleUrls: ['./sidenav-link.component.css']
})
export class SidenavLinkComponent implements OnInit {

    @Input() link: any;
    @Input() pparent: MatSidenav;
    @Input() pwid: number;
    constructor() { }

    ngOnInit() {
    }

    toggleParent = () => {
        if (this.pwid < 840) {
            this.pparent.close();
        }
    }

}
