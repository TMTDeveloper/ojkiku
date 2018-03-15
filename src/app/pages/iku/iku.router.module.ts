import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { IkuComponent } from "./iku.component";
import { IkuHeaderComponent } from "./iku.header/iku.header.component";
const routes: Routes = [
  {
    path: "",
    component: IkuComponent,
    children: [
      {
        path: "iku-header",
        component: IkuHeaderComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IkuRouterModule {}

export const routedComponents = [IkuHeaderComponent, IkuComponent];
