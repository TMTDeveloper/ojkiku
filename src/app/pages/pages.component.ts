import { Component, OnInit } from "@angular/core";
import { MENU_ITEM_USER } from "./pages-menu";
import { MENU_ITEM_ADMIN, MENU_MONI, MENU_MONI_USER } from "./pages-menu";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "../@core/data/users.service";
import { CookieService } from "ngx-cookie-service";
import { BackendService } from "../@core/data/backend.service";
import * as moment from "moment";
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
  menu: any;

  constructor(
    private authService: NbAuthService,
    private activeRoute: ActivatedRoute,
    public backend: UserService,
    private cookie: CookieService,
    public service: BackendService
  ) {
    this.getUserInfo();
  }

  getUserInfo() {
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.user = token.getPayload(); // here we receive a payload from the token and assigne it to our `user` variable
      }
    });
  }

  ngOnInit(): void {
    // let data = {
    //   USERNAME: this.user.USER_NAME,
    //   DATETIME_LOGIN: moment().format(),
    //   COMPONENT: this.cookie.get("Type") == "moni" ? "MONI" : "MOKA"
    // };

    // this.service.postreq("LOGIN_LOGS", data).subscribe(response => {
    //   console.log(response);
    // });

    if (this.cookie.get("Type") == "moni") {
      if (this.user.TEAM == "admin") {
        this.menu = MENU_MONI;
      } else {
        this.menu = MENU_MONI_USER;
      }
    } else {
      if (this.user.TEAM != "admin") {
        this.menu = MENU_ITEM_USER;
      } else {
        this.menu = MENU_ITEM_ADMIN;
      }
    }
  }
}
