import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";

@Component({
  selector: "ngx-realisasi-quantitative",
  templateUrl: "./realisasi.quantitative.component.html"
})
export class RealisasiQuantitativeComponent {
  @ViewChild("myForm") private myForm: NgForm;

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
      confirmSave: true
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
      DESC_BANK: {
        title: "Bank",
        type: "string",
        filter: false,
        editable: false,
        width: "30%"
      },
      NILAI_INDICATOR_1: {
        title: "Indicator 1",
        type: "number",
        filter: false,
        editable: false,
        width: "30%",
        valuePrepareFunction: value => {
          if (isNaN(value)) {
            return 0;
          } else {
            return Number(value)
              .toString()
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
          }
        }
      },
      NILAI_REALISASI_1: {
        title: "Realisasi 1",
        type: "number",
        filter: false,
        editable: true,
        width: "30%",
        valuePrepareFunction: value => {
          if (isNaN(value)) {
            return 0;
          } else {
            return Number(value)
              .toString()
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
          }
        }
      },
      RESULT1: {
        title: "Result 1",
        type: "number",
        filter: false,
        editable: false,
        width: "30%"
      },
      NILAI_INDICATOR_2: {
        title: "Indicator 2",
        type: "number",
        filter: false,
        editable: false,
        width: "30%",
        valuePrepareFunction: value => {
          if (isNaN(value)) {
            return 0;
          } else {
            return Number(value)
              .toString()
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
          }
        }
      },
      NILAI_REALISASI_2: {
        title: "Realisasi 2",
        type: "number",
        filter: false,
        editable: true,
        width: "30%",
        valuePrepareFunction: value => {
          if (isNaN(value)) {
            return 0;
          } else {
            return Number(value)
              .toString()
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
          }
        }
      },
      RESULT2: {
        title: "Result 2",
        type: "number",
        filter: false,
        editable: false,
        width: "30%"
      },
      NILAI_INDICATOR_3: {
        title: "Indicator 3",
        type: "number",
        filter: false,
        editable: false,
        width: "30%",
        valuePrepareFunction: value => {
          if (isNaN(value)) {
            return 0;
          } else {
            return Number(value)
              .toString()
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
          }
        }
      },
      NILAI_REALISASI_3: {
        title: "Realisasi 3",
        type: "number",
        filter: false,
        editable: true,
        width: "30%",
        valuePrepareFunction: value => {
          if (isNaN(value)) {
            return 0;
          } else {
            return Number(value)
              .toString()
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
          }
        }
      },
      RESULT3: {
        title: "Result 3",
        type: "number",
        filter: false,
        editable: false,
        width: "30%"
      },
      PENCAPAIAN: {
        title: "Pencapaian",
        type: "number",
        filter: false,
        editable: false,
        width: "30%"
      }
    }
  };

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
    ikuData: [],
    ikuSelected: "",
    yearPeriode: moment().format("YYYY"),
    threshold: 0,
    indicatorId: "",
    bankData: [],
    realisasiDetail: []
  };

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    public service: BackendService
  ) {
    this.loadData();
  }
  loadData() {
    this.service.getreq("mst_ikus").subscribe(response => {
      if (response != null) {
        this.formData.ikuData = response;
        this.service.getreq("mst_banks").subscribe(response => {
          if (response != null) {
            this.formData.bankData = response;
          }
        });
      }
    });
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

  generateDetail() {
    this.service.getreq("trn_indicator_qns").subscribe(response => {
      if (response != null) {
        let arr = response.filter(item => {
          return (
            item.KODE_IKU == this.formData.ikuSelected &&
            item.TAHUN_INDICATOR == this.formData.yearPeriode &&
            item.PERIODE == this.formData.periodeSelected
          );
        });
        if (arr[0] != null) {
          this.formData.indicatorId = arr[0].KODE_INDIKATOR;
          this.service.getreq("trn_indicator_qn_dtls").subscribe(response => {
            if (response != null) {
              let arrDtl = response.filter(item => {
                return (
                  item.KODE_IKU == this.formData.ikuSelected &&
                  item.TAHUN_INDICATOR == this.formData.yearPeriode &&
                  item.PERIODE == this.formData.periodeSelected
                );
              });
              if (arrDtl[0] != null) {
                let realisasiDetail = [];
                arrDtl.forEach((element, ind) => {
                  let detail = {
                    KODE_IKU: this.formData.ikuSelected,
                    TAHUN_REALISASI: this.formData.yearPeriode,
                    PERIODE: this.formData.periodeSelected,
                    KODE_BANK: element.KODE_BANK,
                    NILAI_INDICATOR_1: element.NILAI_INDICATOR_1,
                    NILAI_INDICATOR_2: element.NILAI_INDICATOR_2,
                    NILAI_INDICATOR_3: element.NILAI_INDICATOR_3,
                    NILAI_REALISASI_1: 0,
                    NILAI_REALISASI_2: 0,
                    NILAI_REALISASI_3: 0,
                    RESULT1: "0%",
                    RESULT2: "0%",
                    RESULT3: "0%",
                    PENCAPAIAN: 0,
                    USER_CREATED: "Admin",
                    DATETIME_CREATED: moment().format(),
                    USER_UPDATED: "Admin",
                    DATETIME_UPDATED: moment().format(),
                    DESC_BANK: this.formData.bankData.filter(item => {
                      return item.ID_BANK == element.KODE_BANK;
                    })[0].DESCRIPTION
                  };

                  realisasiDetail.push(detail);
                });
                this.tabledata = realisasiDetail;
                this.formData.realisasiDetail = realisasiDetail;
                this.source.load(this.tabledata);
              }
            }
          });
        } else {
          this.toastr.error("Data Not Found!");
          this.tabledata = [];
          this.source.load(this.tabledata);
        }
      }
    });
  }

  save() {
    let header = {
      KODE_IKU: this.formData.ikuSelected,
      TAHUN_REALISASI: this.formData.yearPeriode,
      PERIODE: this.formData.periodeSelected,
      KODE_INDIKATOR: this.formData.indicatorId,
      PENCAIPAIAN: 0,
      USER_CREATED: "Admin",
      DATETIME_CREATED: moment().format(),
      USER_UPDATED: "Admin",
      DATETIME_UPDATED: moment().format()
    };
    this.service.postreq("trn_realization_qns/crud", header).subscribe(
      response => {
        console.log(response);
        this.formData.realisasiDetail.forEach((element, ind) => {
          this.service
            .postreq("trn_realization_qn_dtls/crud", element)
            .subscribe(
              response => {
                console.log(response);
              },
              error => {
                console.log("indicator detail");
                console.log(error);
              }
            );
        });
        this.toastr.success("Data Saved!");
      },
      error => {
        console.log("indicator header");
        console.log(error);
      }
    );
  }

  editConfirm(event) {
    event.newData.RESULT1 =
      (
        event.newData.NILAI_REALISASI_1 /
        event.newData.NILAI_INDICATOR_1 *
        100
      ).toFixed(2) + "%";
    event.newData.RESULT2 =
      (
        event.newData.NILAI_REALISASI_2 /
        event.newData.NILAI_INDICATOR_2 *
        100
      ).toFixed(2) + "%";
    event.newData.RESULT3 =
      (
        event.newData.NILAI_REALISASI_3 /
        event.newData.NILAI_INDICATOR_3 *
        100
      ).toFixed(2) + "%";
    console.log(event.newData.RESULT1);
    event.confirm.resolve(event.newData);
  }
}
