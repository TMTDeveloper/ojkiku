import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthGuard } from "../security/auth-guard.service";

const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    component: PagesComponent,
    children: [
      {
        path: "report",
        canActivate: [AuthGuard],
        loadChildren: "./report/report.module#ReportModule"
      },
      {
        path: "dashboard",
        canActivate: [AuthGuard],
        component: DashboardComponent
      },
      {
        path: "iku",
        canActivate: [AuthGuard],
        loadChildren: "./iku/iku.module#IkuModule"
      },
      {
        path: "",
        canActivate: [AuthGuard],
        redirectTo: "dashboard",
        pathMatch: "full"
      },
      {
        path: "realisasi",
        canActivate: [AuthGuard],
        loadChildren: "./realisasi/realisasi.module#RealisasiModule"
      },
      {
        path: "master",
        canActivate: [AuthGuard],
        loadChildren: "./master/master.module#MasterModule"
      },
      {
        path: "transaction",
        canActivate: [AuthGuard],
        loadChildren: "./transaction/transaction.module#TransactionModule"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
