import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";
import { DashboardModule } from "./dashboard/dashboard.module";
import { PagesRoutingModule } from "./pages-routing.module";
import { ThemeModule } from "../@theme/theme.module";
import { DataModule } from "../@core/data/data.module";
import { HttpModule } from "@angular/http";
import { BackendService } from "../@core/data/backend.service";
const PAGES_COMPONENTS = [PagesComponent];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    DataModule,
    HttpModule
  ],
  declarations: [...PAGES_COMPONENTS],
  providers: [BackendService]
})
export class PagesModule {}
