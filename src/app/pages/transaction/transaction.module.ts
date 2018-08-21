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
import { MokaRealisasiDatePicker } from "./moka-realisasi/button.moka.realisasi.component";
import { MokaTargetModalComponent } from "./moka-target/modal/moka.target.modal.component";
import { RealisasiQualitativeModalComponent } from "./realisasi-qualitative/modal/realisasi.qualitative.modal.component";
import { IndicatorStrategicModalComponent } from "./indicator-strategic/modal/indicator.strategic.modal.component";
import { MokaChartComponent } from "./moka-chart/moka.chart.component";



@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    TransactionRouterModule,
    CurrencyMaskModule,
    ToastrModule.forRoot()
  ],
  declarations: [...routedComponents, ButtonRenderComponent, MokaRealisasiDatePicker],
  entryComponents: [
    MokaTargetModalComponent,
    RealisasiQualitativeModalComponent,
    IndicatorQuantitativeModalComponent,
    IndicatorQualitativeModalComponent,
    ButtonRenderComponent,
    MokaRealisasiDatePicker,
    IndicatorStrategicModalComponent,
    MokaChartComponent
  ],
  providers: [
    BackendService,
  ]
})
export class TransactionModule { }
