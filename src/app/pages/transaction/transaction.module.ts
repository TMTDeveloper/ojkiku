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
@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    TransactionRouterModule,
    CurrencyMaskModule,
    ToastrModule.forRoot()
  ],
  declarations: [...routedComponents],
  entryComponents: [IndicatorQuantitativeModalComponent,IndicatorQualitativeModalComponent],
  providers: [BackendService]
})
export class TransactionModule {}
