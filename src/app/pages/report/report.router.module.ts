import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ReportComponent } from "./report.component";
import { ReportIkuComponent } from "./report-iku/report.iku.component";
import { ReportMonaComponent } from "./report-mona/report.mona.component";

const routes: Routes = [
  {
    path: "",
    component: ReportComponent,
    children: [
      {
        path: "report-iku",
        component: ReportIkuComponent
      },
      {
        path: "report-mona",
        component: ReportMonaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRouterModule {}

export const routedComponents = [
  ReportComponent,
  ReportIkuComponent,
  ReportMonaComponent
];
