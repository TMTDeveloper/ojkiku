import { NgModule } from "@angular/core";

import { Ng2SmartTableModule } from "ng2-smart-table";
import {
  RealisasiRouterModule,
  routedComponents
} from "./realisasi.router.module";
import { ThemeModule } from "../../@theme/theme.module";
import { BackendService } from "../../@core/data/backend.service";
import { ToastrModule } from 'ngx-toastr';
@NgModule({
  imports: [ThemeModule, Ng2SmartTableModule, RealisasiRouterModule,ToastrModule.forRoot()],
  declarations: [...routedComponents],
  entryComponents: [],
  providers: [BackendService]
})
export class RealisasiModule {}
