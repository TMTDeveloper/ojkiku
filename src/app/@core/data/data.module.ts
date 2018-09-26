import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { UserService } from "./users.service";
import { StateService } from "./state.service";
import { BackendService } from "./backend.service";
import { HttpModule } from "@angular/http";
const SERVICES = [UserService, StateService, BackendService];

@NgModule({
  imports: [CommonModule, HttpClientModule,HttpModule],
  providers: [...SERVICES]
})
export class DataModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: DataModule,
      providers: [...SERVICES]
    };
  }
}
