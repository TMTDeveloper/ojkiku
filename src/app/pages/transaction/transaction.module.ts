import { NgModule } from "@angular/core";

import { Ng2SmartTableModule } from "ng2-smart-table";
import {
  TransactionRouterModule,
  routedComponents
} from "./transaction.router.module";
import { ThemeModule } from "../../@theme/theme.module";
import { ToastrModule } from "ngx-toastr";
import { BackendService } from "../../@core/data/backend.service";
import { CurrencyMaskModule } from "ng2-currency-mask";

// PAGES COMPONENT
import { IndicatorQuantitativeModalComponent } from "./indicator-quantitative/modal/indicator.quantitative.modal.component";
import { IndicatorQualitativeModalComponent } from "./indicator-qualitative/modal/indicator.qualitative.modal.component";
import { ButtonRenderComponent } from "./realisasi-qualitative/button.realisasi.quantitative.component";
import { CustomEditorComponent } from "./moka-realisasi/CustomEditorComponent";
import { MokaTargetModalComponent } from "./moka-target/modal/moka.target.modal.component";
import { RealisasiQualitativeModalComponent } from "./realisasi-qualitative/modal/realisasi.qualitative.modal.component";
import { IndicatorStrategicModalComponent } from "./indicator-strategic/modal/indicator.strategic.modal.component";
import { MokaChartComponent } from "./moka-chart/moka.chart.component";
import { MyDatePickerModule } from "mydatepicker";
import { OrderModule } from "ngx-order-pipe";
import { DetailAtkModalComponent } from "./detail-atk/modal/detail.atk.modal.component";
import { ReportAtkModalComponent } from "./report-atk/modal/report.atk.modal.component";

@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    TransactionRouterModule,
    CurrencyMaskModule,
    ToastrModule.forRoot(),
    MyDatePickerModule,
    OrderModule
  ],
  declarations: [
    ...routedComponents,
    ButtonRenderComponent,
    CustomEditorComponent
  ],
  entryComponents: [
    MokaTargetModalComponent,
    RealisasiQualitativeModalComponent,
    IndicatorQuantitativeModalComponent,
    IndicatorQualitativeModalComponent,
    ButtonRenderComponent,
    CustomEditorComponent,
    IndicatorStrategicModalComponent,
    DetailAtkModalComponent,
    MokaChartComponent,
    ReportAtkModalComponent
  ],
  providers: [BackendService]
})
export class TransactionModule {}
