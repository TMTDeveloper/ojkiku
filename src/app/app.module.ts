/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {
  APP_BASE_HREF,
  LocationStrategy,
  PathLocationStrategy
} from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpModule } from "@angular/http";
import { BackendService } from "./@core/data/backend.service";
import { CoreModule } from "./@core/core.module";
import { NgxLoginComponent } from "./@theme/components/auth/login/login.component";
import { NgxLoginMoniComponent } from "./@theme/components/auth/login-moni/login.moni.component";
import { ThemeModule } from "./@theme/theme.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NB_AUTH_TOKEN_CLASS, NbAuthJWTToken } from "@nebular/auth";
import { AuthGuard } from "./security/auth-guard.service";
import { CookieService } from "ngx-cookie-service";

@NgModule({
  declarations: [AppComponent, NgxLoginComponent, NgxLoginMoniComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    HttpModule
  ],
  bootstrap: [AppComponent],
  providers: [
    CookieService,
    {
      provide: APP_BASE_HREF,
      useValue: "/"
    },
    { provide: NB_AUTH_TOKEN_CLASS, useValue: NbAuthJWTToken },
    AuthGuard,
    BackendService
  ]
})
export class AppModule {}
