import { Component } from "@angular/core";
import * as moment from "moment";
import { LocalDataSource } from "ng2-smart-table";
import { BackendService } from "../../../@core/data/backend.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "ngx-report-moka",
  templateUrl: "./report.moka.component.html"
})
export class ReportMokaComponent {

  source: LocalDataSource = new LocalDataSource();

  tabledata: any[] = [];

  subscription: any;
  activeModal: any;
  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: false
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: false
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: false
    },
    mode: "inline",
    sort: true,
    hideSubHeader: true,
    actions: {
      add: false,
      edit: true,
      delete: false,
      position: "right",
      columnTitle: "Modify",
      width: "10%"
    },
    pager: {
      display: true,
      perPage: 30
    },
    columns: {
      NO: {
        title: "NO",
        type: "number",
        filter: false,
        editable: false,
        width: "1%"
      },
      TIPE_DOKUMEN: {
        title: "Tipe Dokumen",
        type: "string",
        filter: false,
        editable: false,
        width: "3%"
      },
      ID_BANK: {
        title: "Bank",
        type: "string",
        filter: false,
        editable: false,
        width: "15%"
      },
      START_DATE: {
        title: "Start Date",
        type: "date",
        filter: false,
        editable: true,
        width: "5%"
      },
      TARGET_DATE: {
        title: "Target Date",
        type: "date",
        filter: false,
        editable: false,
        width: "5%",
      },
      REALIZATION_DATE: {
        title: "Realization Date",
        type: "string",
        filter: false,
        editable: true,
        width: "15%",
      },
      KETERANGAN: {
        title: "Keterangan",
        type: "string",
        filter: false,
        editable: true,
        width: "20%",
      },
      USER_REALIZATION: {
        title: "Updated By",
        type: "string",
        filter: false,
        editable: true,
        width: "10%",
      },
    }
  };

  formData = {
    documentData: [],
    documentSelected: "",
    bankSelected: "",
    years: moment().format("YYYY"),
    threshold: 0,
    bankData: [],
    monaRealisasiData: []
  };

  constructor(
    public service: BackendService,
    private toastr: ToastrService
  ) {
    this.loadData();
  }

  loadData() {
    this.service.getreq("mst_banks").subscribe(response => {
      if (response != null) {
        this.formData.bankData = response;
      }
    });
    this.service.getreq("mst_documents").subscribe(response => {
      if (response != null) {
        let documentFilter = response.filter(item => {
          return (
            item.FLAG == 'Y'
          )
        });
        if (documentFilter[0] != null) {
          this.formData.documentData = documentFilter
        }
      }
    });
  }




  async getData() {
    let monaTargetData: any[];
    let monaRealisasi: any[];

    await this.service.getreq("trn_monas").toPromise().then(resp => {
      if (resp != null) {
        monaTargetData = resp
      }
    });

    await this.service.getreq("trn_mona_realizations").toPromise().then(res => {
      if (res != null) {
        monaRealisasi = res;
      }
    });

    let arrMonaTargetData = await monaTargetData.filter(items => {
      return (
        items.ID_BANK == this.formData.bankSelected &&
        items.TIPE_DOKUMEN == this.formData.documentSelected &&
        items.YEAR == this.formData.years
      );
    });

    if (arrMonaTargetData[0] != null) {

      let monaTargetdetail = [];

      await arrMonaTargetData.forEach((element, index) => {
        let detail = {
          NO: 1,
          KODE_BANK: 0,
          TIPE_DOKUMEN: "kosong",
          ID_BANK: "kosong",
          START_DATE: "kosong",
          TARGET_DATE: "kosong",
          REALIZATION_DATE: "kosong",
          USER_REALIZATION: "Kosong",
          KETERANGAN: "Belum di isi",
          YEAR: 0,
          WARNA: ""
        };

        detail.NO = index + 1;
        detail.KODE_BANK = element.ID_BANK;
        detail.TIPE_DOKUMEN = element.TIPE_DOKUMEN;
        detail.YEAR = element.YEAR;
        detail.START_DATE = moment(element.START_DATE).format("DD/MM/YYYY");
        detail.TARGET_DATE = moment(element.TARGET_DATE).format("DD/MM/YYYY");

        let arrBank = this.formData.bankData.filter(item => {
          return (
            item.ID_BANK == element.ID_BANK
          );
        });

        if (arrBank[0] != null) {
          detail.ID_BANK = arrBank[0].DESCRIPTION
        }

        let arrs = monaRealisasi.filter(items => {
          return (
            items.ID_BANK == detail.KODE_BANK &&
            items.TIPE_DOKUMEN == detail.TIPE_DOKUMEN &&
            items.YEAR == detail.YEAR
          );
        });

        if (arrs[0] != null) {
          if (arrs[0].REALIZATION_DATE != null) {
            detail.REALIZATION_DATE = moment(arrs[0].REALIZATION_DATE).format("DD/MM/YYYY");
          } else {
            detail.REALIZATION_DATE = "kosong"
          }



          if (moment(detail.REALIZATION_DATE, "DD/MM/YY").isSame(moment(detail.TARGET_DATE, "DD/MM/YY")) == true) {
            detail.WARNA = "0"
          } else if (moment(detail.REALIZATION_DATE, "DD/MM/YY").isSameOrBefore(moment(detail.TARGET_DATE, "DD/MM/YY").add(3, 'd')) == true) {
            detail.WARNA = "3"
          } else if (moment(detail.REALIZATION_DATE, "DD/MM/YY").isSameOrAfter(moment(detail.TARGET_DATE, "DD/MM/YY").add(5, 'd')) == true) {
            detail.WARNA = "5"
          } 

          console.log(detail.WARNA)

          detail.KETERANGAN = arrs[0].KETERANGAN;
          detail.USER_REALIZATION = arrs[0].USER_REALIZATION;
          console.log(detail)
        }

        monaTargetdetail.push(detail);
      });
      this.formData.monaRealisasiData = monaTargetdetail;
      this.tabledata = monaTargetdetail;


    } else {
      this.toastr.error("Data Not Found!")
      this.tabledata = []
    }
  }


  updateData() {
    this.tabledata.forEach((element) => {
      let header = {
        ID_BANK: element.KODE_BANK,
        YEAR: element.YEAR,
        TIPE_DOKUMEN: element.TIPE_DOKUMEN,
        KETERANGAN: element.KETERANGAN,
        USER_REALIZATION: "admin",
        REALIZATION_DATE: element.REALIZATION_DATE,
        USER_UPDATED: "admin",
        DATE_UPDATED: moment().format()
      }

      if (element.REALIZATION_DATE == "kosong") {
        header.REALIZATION_DATE = null
      } else {
        header.REALIZATION_DATE = moment(this.dateReformat(element.REALIZATION_DATE)).format()
      }
      this.service.postreq("trn_mona_realizations/crud", header).subscribe(
        response => {
          console.log(response);
          this.toastr.success("Data Saved!");
        },
        error => {
          this.toastr.error("Error, Cek kembali data!")
          console.log(error);
        }
      )
    })

  }

  editConfirm(event) {

    console.log(event.newData);
    event.confirm.resolve(event.newData);
  }

  submit(event) {
    this.tabledata.forEach((element, ind) => {
      if (element.KODE_IKU == event.newData.KODE_IKU) {
        element.KODE_IKU = event.newData.KODE_IKU;
        element.DESKRIPSI = event.newData.DESKRIPSI;
        element.TIPE_IKU = event.newData.TIPE_IKU;
        this.service
          .patchreq("mst_ikus", this.tabledata[ind])
          .subscribe(response => {
            console.log(JSON.stringify(response));
            event.confirm.resolve(event.newData);
            this.toastr.success("Data Updated!");
          });
      }
    });
  }

  dateReformat(value) {
    let str = value.split("/");
    return str[2] + "-" + str[1] + "-" + str[0]
  }



}
