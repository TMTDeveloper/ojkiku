import { NgModule } from '@angular/core';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { IkuRouterModule, routedComponents } from './iku.router.module';
import { ThemeModule } from '../../@theme/theme.module';
import {RbbComponent} from './iku.header/iku.header.component'

@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    IkuRouterModule
  ],
  declarations: [
    ...routedComponents,
    RbbComponent
  ],
  entryComponents: [
    RbbComponent,
  ],
})
export class IkuModule { }
