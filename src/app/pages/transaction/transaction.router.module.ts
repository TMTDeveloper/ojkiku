import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TransactionComponent } from "./transaction.component";
import { IndicatorQuantitativeComponent } from "./indicator-quantitative/indicator.quantitative.component";
import { IndicatorQuantitativeModalComponent } from "./indicator-quantitative/modal/indicator.quantitative.modal.component";
import { RealisasiQuantitativeComponent } from "./realisasi-quantitative/realisasi.quantitative.component";
import { RealisasiQualitativeComponent } from "./realisasi-qualitative/realisasi.qualitative.component";
import { IndicatorQualitativeComponent } from "./indicator-qualitative/indicator.qualitative.component";
import { IndicatorQualitativeModalComponent } from "./indicator-qualitative/modal/indicator.qualitative.modal.component";
import { MokaTargetComponent } from "./moka-target/moka.target.component";
import { MokaTargetModalComponent } from "./moka-target/modal/moka.target.modal.component";
import { MokaRealisasiComponent } from "./moka-realisasi/moka.realisasi.component";
import { RealisasiQualitativeModalComponent } from "./realisasi-qualitative/modal/realisasi.qualitative.modal.component";
import { IndicatorStrategicComponent } from "./indicator-strategic/indicator.strategic.component";
import { RealisasiStrategicComponent } from "./realisasi-strategic/realisasi.strategic.component";
import { IndicatorStrategicModalComponent } from "./indicator-strategic/modal/indicator.strategic.modal.component";
import { MokaChartComponent } from "./moka-chart/moka.chart.component";

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
      },
      {
        path: "indicator-strategic",
        component: IndicatorStrategicComponent
      },
      {
        path: "realisasi-strategic",
        component: RealisasiStrategicComponent
      },      
      {
        path: "moka-target",
        component: MokaTargetComponent
      },
      {
        path: "moka-realisasi",
        component: MokaRealisasiComponent
      },
      {
        path: "moka-chart",
        component: MokaChartComponent
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
  IndicatorQualitativeModalComponent,
  RealisasiQualitativeComponent,
  IndicatorQuantitativeComponent,
  IndicatorQuantitativeModalComponent,
  RealisasiQuantitativeComponent,
  TransactionComponent,
  MokaTargetComponent,
  MokaTargetModalComponent,
  MokaRealisasiComponent,
  RealisasiQualitativeModalComponent,
  IndicatorStrategicComponent,
  IndicatorStrategicModalComponent,
  RealisasiStrategicComponent,
  MokaChartComponent
];
