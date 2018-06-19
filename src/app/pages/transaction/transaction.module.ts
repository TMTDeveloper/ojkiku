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
import { IndicatorQuantitativeModalComponent } from "./indicator-quantitative/modal/indicator.quantitative.modal.component";
import { IndicatorQualitativeModalComponent } from "./indicator-qualitative/modal/indicator.qualitative.modal.component";
import { ButtonRenderComponent } from "./realisasi-qualitative/button.realisasi.quantitative.component";
import { MonaTargetModalComponent } from "./mona-target/modal/mona.target.modal.component";
import { MonaRealisasiModalComponent } from "./mona-realisasi/modal/mona.realisasi.modal.component";


@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    TransactionRouterModule,
    CurrencyMaskModule,
    ToastrModule.forRoot()
  ],
  declarations: [...routedComponents,ButtonRenderComponent],
  entryComponents: [MonaTargetModalComponent,MonaRealisasiModalComponent,IndicatorQuantitativeModalComponent,IndicatorQualitativeModalComponent,ButtonRenderComponent],
  providers: [BackendService]
})
export class TransactionModule {}
