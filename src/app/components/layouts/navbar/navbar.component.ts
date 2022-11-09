import { Component } from "@angular/core";

@Component( {
    selector : 'navbar',
    templateUrl : './navbar.component.html',
    styleUrls : ['./navbar.component.css']
})

export class NavbarComponent {
    polybiusActive! : boolean;
    xorActive! : boolean;
    aboutActive! : boolean;
    homeActive : boolean = true;
    constructor(){}

    homeActivex() : void {
        this.homeActive = true;
        this.aboutActive = false;
        this.xorActive = false;
        this.polybiusActive = false;
    }

    polybiusActivex() : void {
        this.polybiusActive = true;
        this.xorActive = false;
        this.aboutActive = false;
        this.homeActive = false;
    }
    xorActivex() : void {
        this.xorActive = true;
        this.polybiusActive = false;
        this.aboutActive = false;
        this.homeActive = false;
    }
    aboutActivex() : void {
        this.aboutActive = true;
        this.polybiusActive = false;
        this.xorActive = false;
        this.homeActive = false;
    }
}