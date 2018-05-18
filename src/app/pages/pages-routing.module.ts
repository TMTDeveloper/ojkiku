import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "report",
        loadChildren: "./report/report.module#ReportModule"
      },
      {
        path: "dashboard",
        component: DashboardComponent
      },
      {
        path: "iku",
        loadChildren: "./iku/iku.module#IkuModule"
      },
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
      },
      {
        path: "realisasi",
        loadChildren: "./realisasi/realisasi.module#RealisasiModule"
      },
      {
        path: "master",
        loadChildren: "./master/master.module#MasterModule"
      },
      {
        path: "transaction",
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
