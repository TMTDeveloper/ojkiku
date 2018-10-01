/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { NB_AUTH_OPTIONS, NbAuthSocialLink } from "@nebular/auth/auth.options";
import { getDeepFromObject } from "@nebular/auth/helpers";
import { NbAuthResult } from "@nebular/auth/services/auth-result";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";
import { tap } from "rxjs/operators/tap";
import { UserService } from "../../../../@core/data/users.service";
import { CookieService } from "ngx-cookie-service";
import { BackendService } from "../../../../@core/data/backend.service";
import * as moment from "moment";
@Component({
  selector: "ngx-login",
  template: `
    <nb-auth-block>
    <img src="../../../../../assets/logo.png" alt=""><br><br><br>
      <h2 class="title">Sign In Moni</h2>
      <form (ngSubmit)="login()" #form="ngForm" autocomplete="nope">
        <div *ngIf="showMessages.error && errors && errors.length > 0 && !submitted"
             class="alert alert-danger" role="alert">
          <div><strong>Oh snap!</strong></div>
          <div *ngFor="let error of errors">{{ error }}</div>
        </div>
        <div *ngIf="showMessages.success && messages && messages.length > 0 && !submitted"
             class="alert alert-success" role="alert">
          <div *ngFor="let message of messages">{{ message }}</div>
        </div>
        <div class="form-group">
          <label for="input-user ID" class="sr-only">User ID</label>
          <input name="email" [(ngModel)]="user.email" id="input-email" 
                 class="form-control" placeholder="User ID" #email="ngModel" autofocus>
        </div>
        <div class="form-group">
          <label for="input-password" class="sr-only">Password</label>
          <input name="password" [(ngModel)]="user.password" type="password" id="input-password"
                 class="form-control" placeholder="Password" #password="ngModel"
                 [class.form-control-danger]="password.invalid && password.touched"
                 [required]="getConfigValue('forms.validation.password.required')"
                 [minlength]="getConfigValue('forms.validation.password.minLength')"
                 [maxlength]="getConfigValue('forms.validation.password.maxLength')">
          <small class="form-text error" *ngIf="password.invalid && password.touched && password.errors?.required">
            Password is required!
          </small>
          <small
            class="form-text error"
            *ngIf="password.invalid && password.touched && (password.errors?.minlength || password.errors?.maxlength)">
            Password should contains
            from {{ getConfigValue('forms.validation.password.minLength') }}
            to {{ getConfigValue('forms.validation.password.maxLength') }}
            characters
          </small>
        </div>
        <div class="form-group accept-group col-sm-12">
          <nb-checkbox name="rememberMe" [(ngModel)]="user.rememberMe">Remember me</nb-checkbox>
          <a class="forgot-password" routerLink="../request-password">Forgot Password?</a>
        </div>
        <button [disabled]="submitted || !form.valid" class="btn btn-block btn-hero-success"
                [class.btn-pulse]="submitted">
          Sign In
        </button>
      </form>
      <div class="links">
        <ng-container *ngIf="socialLinks && socialLinks.length > 0">
          <small class="form-text">Or connect with:</small>
          <div class="socials">
            <ng-container *ngFor="let socialLink of socialLinks">
              <a *ngIf="socialLink.link"
                 [routerLink]="socialLink.link"
                 [attr.target]="socialLink.target"
                 [attr.class]="socialLink.icon"
                 [class.with-icon]="socialLink.icon">{{ socialLink.title }}</a>
              <a *ngIf="socialLink.url"
                 [attr.href]="socialLink.url"
                 [attr.target]="socialLink.target"
                 [attr.class]="socialLink.icon"
                 [class.with-icon]="socialLink.icon">{{ socialLink.title }}</a>
            </ng-container>
          </div>
        </ng-container>
      </div>
    </nb-auth-block>
  `
})
export class NgxLoginMoniComponent {
  redirectDelay: number = 0;
  showMessages: any = {};
  provider: string = "";

  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted: boolean = false;
  socialLinks: NbAuthSocialLink[] = [];
  userget: any = {};
  constructor(
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected config = {},
    protected router: Router,
    public backend: UserService,
    private cookie: CookieService,
    public logservice: BackendService
  ) {
    this.redirectDelay = this.getConfigValue("forms.login.redirectDelay");
    this.showMessages = this.getConfigValue("forms.login.showMessages");
    this.provider = this.getConfigValue("forms.login.provider");
    this.socialLinks = this.getConfigValue("forms.login.socialLinks");
  }

  login(): void {
    this.errors = this.messages = [];
    this.submitted = true;

    this.service
      .authenticate(this.provider, this.user)
      .subscribe((result: NbAuthResult) => {
        this.submitted = false;
        if (result.isSuccess()) {
          this.messages = result.getMessages();
          console.log(result);
        } else {
          this.errors = result.getErrors();
        }

        const redirect = result.getRedirect();
        if (redirect) {
          console.log(this.router.url);
          if (this.router.url == "/moni") {
            this.cookie.deleteAll();
            this.cookie.set("Type", "moni");
          } else {
            this.cookie.deleteAll();
            this.cookie.set("Type", "mona");
          }
          this.service.onTokenChange().subscribe((token: NbAuthJWTToken) => {
            if (token.isValid()) {
              this.userget = token.getPayload(); // here we receive a payload from the token and assigne it to our `user` variable
              console.log(this.userget);
              let data = {
                USERNAME: this.userget.USER_NAME,
                DATETIME_LOGIN: moment().format(),
                COMPONENT: this.cookie.get("Type") == "moni" ? "MONI" : "MOKA",
                USER_ID: this.userget.ID_USER
              };
              console.log(data);
              this.logservice.postreq("LOGIN_LOGS", data).subscribe(
                response => {
                  console.log("masuksini");
                },
                error => {
                  console.log(error);
                }
              );
            }
          }).unsubscribe();;
          setTimeout(() => {
            return this.router.navigateByUrl(redirect);
          }, this.redirectDelay);
        }
      });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }
}

export class AuthGuard implements CanActivate {
  constructor(private authService: NbAuthService, private router: Router) {}

  canActivate() {
    return this.authService.isAuthenticated().pipe(
      tap(authenticated => {
        if (!authenticated) {
          this.router.navigate(["auth/login"]);
        }
      })
    );
  }
}
