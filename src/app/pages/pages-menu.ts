import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEM_ADMIN: NbMenuItem[] = [
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
        title: "Report MOKA",
        link: "/pages/report/report-moka"
      }
    ]
  },
  {
    title: "Master",
    icon: "nb-locked",
    children: [
      {
        title: "User",
        link: "/pages/master/master-user"
      },
      {
        title: "User Bank",
        link: "/pages/master/user-bank"
      },
      {
        title: "Bank List",
        link: "/pages/master/master-bank"
      },
      {
        title: "IKU List",
        link: "/pages/master/iku"
      },
      {
        title: "Document List",
        link: "/pages/master/document"
      },
      {
        title: "User Log",
        link: "/pages/master/master-log-user"
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
      },
      {
        title: "Indicator Strategic",
        link: "/pages/transaction/indicator-strategic"
      },
      {
        title: "Realisasi Strategic",
        link: "/pages/transaction/realisasi-strategic"
      }
    ]
  },
  {
    title: "Transaction MOKA",
    icon: "nb-compose",
    children: [
      {
        title: "Target MOKA",
        link: "/pages/transaction/moka-target"
      },
      {
        title: "Realisasi MOKA",
        link: "/pages/transaction/moka-realisasi"
      }
    ]
  }
];

export const MENU_ITEM_USER: NbMenuItem[] = [
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
        title: "Report MOKA",
        link: "/pages/report/report-moka"
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
      },
      {
        title: "Indicator Strategic",
        link: "/pages/transaction/indicator-strategic"
      },
      {
        title: "Realisasi Strategic",
        link: "/pages/transaction/realisasi-strategic"
      }
    ]
  },
  {
    title: "Transaction MOKA",
    icon: "nb-compose",
    children: [
      {
        title: "Target MOKA",
        link: "/pages/transaction/moka-target"
      },
      {
        title: "Realisasi MOKA",
        link: "/pages/transaction/moka-realisasi"
      }
    ]
  }
];

export const MENU_MONI: NbMenuItem[] = [
  {
    title: "Dashboard",
    icon: "nb-home",
    link: "/pages/dashboard",
    home: true
  },
  {
    title: "Master",
    icon: "nb-locked",
    children: [
      {
        title: "Barang",
        link: "/pages/master/master-barang"
      },
      {
        title: "Merk",
        link: "/pages/master/master-merk"
      },
      {
        title: "Log Moni",
        link: "/pages/master/master-log-moni"
      }
    ]
  },
  {
    title: "Transaction MONI",
    icon: "nb-compose",
    children: [
      {
        title: "Assignment Barang",
        link: "/pages/transaction/assignment-barang"
      },
      {
        title: "Beli Barang",
        link: "/pages/transaction/beli-barang"
      },
      {
        title: "Order Atk",
        link: "/pages/transaction/detail-atk"
      },
      {
        title: "Peminjaman Barang",
        link: "/pages/transaction/assignment-pinjam"
      },
      {
        title: "Pengembalian Barang",
        link: "/pages/transaction/assignment-kembali"
      }
    ]
  },
  {
    title: "Report MONI",
    icon: "nb-compose",
    children: [
      {
        title: "Report Assignment",
        link: "/pages/transaction/report-assignment"
      },
      {
        title: "Report Pengembalian",
        link: "/pages/transaction/report-kembali"
      },
      {
        title: "Report Peminjaman",
        link: "/pages/transaction/report-pinjam"
      },
      {
        title: "Report Beli",
        link: "/pages/transaction/report-beli"
      },
      {
        title: "Report Atk",
        link: "/pages/transaction/report-atk"
      },
      {
        title: "Report Inventory",
        link: "/pages/transaction/report-inv"
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
