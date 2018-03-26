import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RealisasiComponent } from "./realisasi.component";
const routes: Routes = [
  {
    path: "",
    component: RealisasiComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RealisasiRouterModule {}

export const routedComponents = [RealisasiComponent];
