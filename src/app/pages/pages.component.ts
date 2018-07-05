import { Component, OnInit } from "@angular/core";
import { MENU_ITEM_USER } from "./pages-menu";
import { MENU_ITEM_ADMIN } from "./pages-menu";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";

@Component({
  selector: "ngx-pages",
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `
})
export class PagesComponent implements OnInit {

  user: any;
  menu : any;

  constructor(
    private authService: NbAuthService,
  ) {
    this.getUserInfo()
  }

  getUserInfo() {
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.user = token.getPayload(); // here we receive a payload from the token and assigne it to our `user` variable
      }
    });
  }

  ngOnInit(): void {
    console.log('ini menu')
    console.log(this.user)
    if(this.user.TEAM != "admin"){
      this.menu = MENU_ITEM_USER
    } else {
      this.menu = MENU_ITEM_ADMIN 
    }
  }

  
  
  
}
