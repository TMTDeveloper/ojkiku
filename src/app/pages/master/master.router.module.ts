import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { MasterComponent } from "./master.component";
import { MasterBankComponent } from "./master-bank/master.bank.component";
import { MasterUserComponent } from "./master-user/master.user.component";
import { MasterUserLogComponent } from "./master-log-user/master.user.log.component";
import { MasterUserBankComponent } from "./user-bank/master.user.bank.component";
import { MasterBarangComponent } from "./master-barang/master.barang.component";
import { MasterMerkComponent } from "./master-merk/master.merk.component";
import { IkuComponent } from "./iku/iku.component";
import { DocumentComponent } from "./document/document.component";

const routes: Routes = [
  {
    path: "",
    component: MasterComponent,
    children: [
      {
        path: "master-user",
        component: MasterUserComponent
      },
      {
        path: "user-bank",
        component: MasterUserBankComponent
      },
      {
        path: "master-bank",
        component: MasterBankComponent
      },
      {
        path: "iku",
        component: IkuComponent
      },
      {
        path: "document",
        component: DocumentComponent
      },
      {
        path: "master-log-user",
        component: MasterUserLogComponent
      },
      {
        path: "master-barang",
        component: MasterBarangComponent
      },
      {
        path: "master-merk",
        component: MasterMerkComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRouterModule {}

export const routedComponents = [
  MasterComponent,
  MasterBankComponent,
  MasterUserComponent,
  MasterUserLogComponent,
  MasterUserBankComponent,
  MasterBarangComponent,
  MasterMerkComponent,
  IkuComponent,
  DocumentComponent
];
