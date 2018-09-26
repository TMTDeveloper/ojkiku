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
import { AssignmentBarangComponent } from "./assignment-barang/assignment.barang.component";
import { BeliBarangComponent } from "./beli-barang/beli.barang.component";
import { DetailAtkComponent } from "./detail-atk/detail.atk.component";
import { DetailAtkModalComponent } from "./detail-atk/modal/detail.atk.modal.component";
import { ReportAtkComponent } from "./report-atk/report.atk.component";
import { ReportAtkModalComponent } from "./report-atk/modal/report.atk.modal.component";
import { ReportAssignmentComponent } from "./report-assignment/report.assignment.component";
import { ReportBeliComponent } from "./report-beli/report.beli.component";
import { AssignmentPinjamComponent } from "./assignment-pinjam/assignment.pinjam.component";
import { AssignmentKembaliComponent } from "./assignment-kembali/assignment.kembali.component";
import { ReportPinjamComponent } from "./report-pinjam/report.pinjam.component";
import { ReportKembaliComponent } from "./report-kembali/report.kembali.component";
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
      },
      {
        path: "assignment-barang",
        component: AssignmentBarangComponent
      },
      {
        path: "beli-barang",
        component: BeliBarangComponent
      },
      {
        path: "detail-atk",
        component: DetailAtkComponent
      },
      {
        path: "report-atk",
        component: ReportAtkComponent
      },
      {
        path: "report-assignment",
        component: ReportAssignmentComponent
      },
      {
        path: "report-beli",
        component: ReportBeliComponent
      },
      {
        path: "assignment-pinjam",
        component: AssignmentPinjamComponent
      },
      {
        path: "assignment-kembali",
        component: AssignmentKembaliComponent
      },
      {
        path: "report-pinjam",
        component: ReportPinjamComponent
      },
      {
        path: "report-kembali",
        component: ReportKembaliComponent
      },
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
  AssignmentBarangComponent,
  DetailAtkComponent,
  BeliBarangComponent,
  ReportAtkModalComponent,
  ReportAtkComponent,
  DetailAtkModalComponent,
  RealisasiStrategicComponent,
  MokaChartComponent,
  ReportAssignmentComponent,
  ReportBeliComponent,
  AssignmentPinjamComponent,
  AssignmentKembaliComponent,
  ReportKembaliComponent,
  ReportPinjamComponent
];
