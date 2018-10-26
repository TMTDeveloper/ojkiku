import { ExtraOptions, RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import {
  NbAuthComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent
} from "@nebular/auth";
import { NgxLoginComponent } from "./@theme/components/auth/login/login.component";
import { NgxLoginMoniComponent } from "./@theme/components/auth/login-moni/login.moni.component";
const routes: Routes = [

  {
    path: "pages",
    loadChildren: "app/pages/pages.module#PagesModule"
  },
  {
    path: "auth",
    component: NbAuthComponent,
    children: [
      {
        path: "",
        component: NgxLoginMoniComponent
      },
      {
        path: "login",
        component: NgxLoginMoniComponent
      },
      {
        path: "register",
        component: NbRegisterComponent
      },
      {
        path: "logout",
        component: NbLogoutComponent
      },
      {
        path: "request-password",
        component: NbRequestPasswordComponent
      },
      {
        path: "reset-password",
        component: NbResetPasswordComponent
      }
    ]
  },
  // {
  //   path: "moni",
  //   component: NbAuthComponent,
  //   children: [
  //     {
  //       path: "",
  //       component: NgxLoginMoniComponent
  //     },
  //     {
  //       path: "login",
  //       component: NgxLoginMoniComponent
  //     },
  //   ]
  // },
  { path: "**", redirectTo: "auth" }
];

const config: ExtraOptions = {
  useHash: true
};

@NgModule({
  imports: [RouterModule.forRoot(routes,config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
