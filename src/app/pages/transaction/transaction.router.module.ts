import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TransactionComponent } from "./transaction.component";
import { IndicatorQuantitativeComponent } from "./indicator-quantitative/indicator.quantitative.component";
import { IndicatorQuantitativeModalComponent } from "./indicator-quantitative/modal/indicator.quantitative.modal.component";
import { RealisasiQuantitativeComponent } from "./realisasi-quantitative/realisasi.quantitative.component";
import { RealisasiQualitativeComponent } from "./realisasi-qualitative/realisasi.qualitative.component";
import { IndicatorQualitativeComponent } from "./indicator-qualitative/indicator.qualitative.component";
const routes: Routes = [
  {
    path: "",
    component: TransactionComponent,
    children: [
      {
        path: "indicator-quantitative",
        component: IndicatorQuantitativeComponent
      },
      {
        path: "realisasi-quantitative",
        component: RealisasiQuantitativeComponent
      },
      {
        path: "realisasi-qualitative",
        component: RealisasiQualitativeComponent
      },
      {
        path: "indicator-qualitative",
        component: IndicatorQualitativeComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRouterModule {}

export const routedComponents = [
  IndicatorQualitativeComponent,
  RealisasiQualitativeComponent,
  IndicatorQuantitativeComponent,
  IndicatorQuantitativeModalComponent,
  RealisasiQuantitativeComponent,
  TransactionComponent
];
