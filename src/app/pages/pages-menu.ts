import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: "Dashboard",
    icon: "nb-home",
    link: "/pages/dashboard",
    home: true
  },
  {
    title: "Reporting",
    icon: "nb-bar-chart",
    children: [
      {
        title: "Report IKU",
        link: "/pages/report/report-iku"
      },
      {
        title: "Report MONA",
        link: "/pages/report/report-mona"
      }
    ]
  },
  {
    title: "Master",
    icon: "nb-locked",
    children: [
      {
        title: "Bank",
        link: "/pages/master/master-bank"
      },
      {
        title: "User",
        link: "/pages/master/master-user"
      },
      {
        title: "User Log",
        link: "/pages/master/master-log-user"
      },
      {
        title: "User Bank",
        link: "/pages/master/user-bank"
      },
      {
        title: "Iku",
        link: "/pages/master/iku"
      }
    ]
  },
  {
    title: "Transaction IKU",
    icon: "nb-compose",
    children: [
      {
        title: "Indicator Quantitative",
        link: "/pages/transaction/indicator-quantitative"
      },
      {
        title: "Realisasi Quantitative",
        link: "/pages/transaction/realisasi-quantitative"
      },
      {
        title: "Indicator Qualitative",
        link: "/pages/transaction/indicator-qualitative"
      },
      {
        title: "Realisasi Qualitative",
        link: "/pages/transaction/realisasi-qualitative"
      }
    ]
  },
  {
    title: "Transaction MONA",
    icon: "nb-compose",
    children: [
      {
        title: "Target Mona",
        link: "/pages/transaction/mona-target"
      },
      {
        title: "Realisasi Mona",
        link: "/pages/transaction/mona-realisasi"
      }
    ]
  }
];

// {
//   title: 'FEATURES',
//   group: true,
// },
// {
//   title: 'Auth',
//   icon: 'nb-locked',
//   children: [
//     {
//       title: 'Login',
//       link: '/auth/login',
//     },
//     {
//       title: 'Register',
//       link: '/auth/register',
//     },
//     {
//       title: 'Request Password',
//       link: '/auth/request-password',
//     },
//     {
//       title: 'Reset Password',
//       link: '/auth/reset-password',
//     },
//   ],
// },
