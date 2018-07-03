import { Component } from "@angular/core";
import * as moment from "moment";
import { BackendService } from "../../../@core/data/backend.service";
import { Angular2Csv } from "angular2-csv/Angular2-csv";
import { ToastrService } from "ngx-toastr";
import * as XLSX from 'xlsx';

@Component({
  selector: "ngx-report-iku",
  templateUrl: "./report.iku.component.html"
})
export class ReportIkuComponent {
  disableInput: boolean;
  tabledata: any;

  formData = {
    periode: [
      {
        id: "TW1",
        desc: "Triwulan 1"
      },
      {
        id: "TW2",
        desc: "Triwulan 2"
      },
      {
        id: "TW3",
        desc: "Triwulan 3"
      },
      {
        id: "TW4",
        desc: "Triwulan 4"
      }
    ],
    periodeSelected: "",
    TahunSelected: moment().format("YYYY")
  };

  constructor(public service: BackendService, private toastr: ToastrService) { }

  getReport() {
    this.service.getreq("ikureports").subscribe(res => {
      if (res != null) {
        let arr = res.filter(item => {
          return (
            item.TAHUN_REALISASI == this.formData.TahunSelected &&
            item.PERIODE == this.formData.periodeSelected
          );
        });
        console.log(arr);
        if (arr[0] != null) {
          let sortArr = arr.sort(function (a, b) {
            return a.KODE_IKU > b.KODE_IKU
              ? 1
              : b.KODE_IKU > a.KODE_IKU
                ? -1
                : 0;
          });
          this.tabledata = sortArr;
          this.toastr.success("Get Data Success!");
        } else {
          this.tabledata = [];
          this.toastr.error("Belum Ada Data!");
        }
      }
    });
  }

  generateXLSX() {
    
  /* starting from this data */
var data = [
  { name: "Barack Obama", pres: 44 },
  { name: "Donald Trump", pres: 45 }
];

/* generate a worksheet */
var ws = XLSX.utils.json_to_sheet(this.tabledata);

/* add to workbook */
var wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Presidents");

/* write workbook and force a download */
XLSX.writeFile(wb, "sheetjs.xlsx");
  }

  generateCSV() {
    let filename =
      "Report IKU " +
      this.formData.TahunSelected +
      " " +
      this.formData.periodeSelected;

    let csvSetting = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalseparator: ".",
      showLabels: true,
      showTitle: true,
      useBom: true,
      noDownload: true,
      headers: [
        "Kode IKU",
        "TAHUN_REALISASI",
        "PERIODE",
        "Nilai Realisasi",
        "Indikator",
        "Realisasi",
        "Target",
        "Pencapaian"
      ]
    };
    new Angular2Csv(this.tabledata, filename, csvSetting);
    console.log("Generate CSV");
  }
}
