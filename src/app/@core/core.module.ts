import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { NbAuthModule, NbEmailPassAuthProvider } from "@nebular/auth";
import { NbSecurityModule, NbRoleProvider } from "@nebular/security";
import { of as observableOf } from "rxjs/observable/of";
import { throwIfAlreadyLoaded } from "./module-import-guard";
import { DataModule } from "./data/data.module";
import { AnalyticsService } from "./utils/analytics.service";

// const socialLinks = [{
//     url: 'https://github.com/akveo/nebular',
//     target: '_blank',
//     icon: 'socicon-github',
//   },
//   {
//     url: 'https://www.facebook.com/akveo/',
//     target: '_blank',
//     icon: 'socicon-facebook',
//   },
//   {
//     url: 'https://twitter.com/akveo_inc',
//     target: '_blank',
//     icon: 'socicon-twitter',
//   },
// ];

const NB_CORE_PROVIDERS = [
  ...DataModule.forRoot().providers,
  ...NbAuthModule.forRoot({
    providers: {
      email: {
        service: NbEmailPassAuthProvider,
        config: {
          token: {
            key: "data.token"
          },
          baseEndpoint: "",
          delay: 1,
          login: {
            alwaysFail: false,
            rememberMe: true,
            endpoint: "http://192.168.1.10:3000/api/LOGIN_IKUs/login",
            method: "post",
            redirect: {
              success: "/pages",
              failure: null
            },
            defaultErrors: [
              "Login/Email combination is not correct, please try again."
            ],
            defaultMessages: ["You have been successfully logged in."]
          },
          logout: {
            endpoint: '',
          },
        }
      }
    },
    forms: {
      login: {
        provider: "email"
      },
      register: {}
    }
  }).providers,
  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: "*"
      },
      user: {
        parent: "guest",
        create: "*",
        edit: "*",
        remove: "*"
      }
    }
  }).providers,
  {
    provide: NbRoleProvider,
    useValue: {
      getRole: () => {
        return observableOf("guest"); // here you could provide any role based on any auth flow
      }
    }
  },
  AnalyticsService
];

@NgModule({
  imports: [CommonModule],
  exports: [NbAuthModule],
  declarations: []
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, "CoreModule");
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [...NB_CORE_PROVIDERS]
    };
  }
}
