import { NgModule } from "@angular/core";

import { Ng2SmartTableModule } from "ng2-smart-table";
import { ReportRouterModule, routedComponents } from "./report.router.module";
import { ThemeModule } from "../../@theme/theme.module";
import { BackendService } from "../../@core/data/backend.service";
import { ToastrModule } from "ngx-toastr";


@NgModule({
  imports: [ThemeModule, Ng2SmartTableModule, ReportRouterModule,ToastrModule.forRoot()],
  declarations: [...routedComponents,],
  entryComponents: [],
  providers: [
    BackendService,

  ]
})
export class ReportModule { }
