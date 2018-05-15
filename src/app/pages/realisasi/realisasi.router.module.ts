import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RealisasiComponent } from "./realisasi.component";
import { RealisasiQuantitativeComponent } from "./realisasi-quantitative/realisasi.quantitative.component";
import {RealisasiQualitativeComponent} from "./realisasi-qualitative/realisasi.qualitative.component"
const routes: Routes = [
  {
    path: "",
    component: RealisasiComponent,
    children: [
      {
        path: "realisasi-quantitative",
        component: RealisasiQuantitativeComponent
      }, {
        path: "realisasi-qualitative",
        component: RealisasiQualitativeComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RealisasiRouterModule {}

export const routedComponents = [RealisasiComponent,RealisasiQuantitativeComponent,RealisasiQualitativeComponent];
