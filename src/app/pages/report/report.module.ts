import { NgModule } from "@angular/core";

import { Ng2SmartTableModule } from "ng2-smart-table";
import { ReportRouterModule, routedComponents } from "./report.router.module";
import { ThemeModule } from "../../@theme/theme.module";
import { BackendService } from "../../@core/data/backend.service";

@NgModule({
  imports: [ThemeModule, Ng2SmartTableModule, ReportRouterModule],
  declarations: [...routedComponents,],
  entryComponents: [],
  providers: [BackendService]
})
export class ReportModule {}
