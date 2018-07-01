import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";
import { TYPED_NULL_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "ngx-realisasi-strategic",
  templateUrl: "./realisasi.strategic.component.html",
  styles: [
    `
      input:disabled {
        background-color: rgba(211, 211, 211, 0.6);
      }
    `
  ]
})
export class RealisasiStrategicComponent {
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
    sort: false,
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
        title: "Indikator",
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
        title: "Realisasi",
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
        title: "Result",
        type: "number",
        filter: false,
        editable: false,
        width: "30%"
      },
      TARGET: {
        title: "Target",
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
    bankData: [
      {
        ID_BANK: "000",
        INISIAL: "OJK",
        DESCRIPTION: "Otorisasi Jasa Keuangan",
      }
    ],
    periodeSelected: "",
    ikuData: [],
    ikuSelected: "",
    yearPeriode: moment().format("YYYY"),
    threshold: 0,
    indicatorId: "",
    realisasiDetail: []
  };

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    public service: BackendService
  ) {
    this.loadData();
  }

  async loadData() {
    let respIku: any[];
    await this.service.getreq("mst_ikus").toPromise().then(response => {
      if (response != null) {
        respIku = response;
      }
    });
    let arr = await respIku.filter(item => {
      return (
        item.TIPE_IKU == "STRATEGIC"
      )
    });

    if (arr[0] != null) {
      this.formData.ikuData = arr;
    } else {
      this.toastr.error("Tidak Ditemukan IKU Qualitative Data")
    }
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

  async getData() {
    "use strict";
    let realisasiDetail = []
    let indicatorQnData: any[]
    let indicatorQnDtlData: any[]
    let realizationQnDtlData: any[]

    await this.service.getreq("trn_indicator_qns").toPromise().then(response => {
      if (response != null) {
        indicatorQnData = response
      }
    });

    await this.service.getreq("trn_indicator_qn_dtls").toPromise().then(response => {
      if (response != null) {
        indicatorQnDtlData = response
      }
    });

    await this.service.getreq("trn_realization_qn_dtls").toPromise().then(response => {
      if (response != null) {
        realizationQnDtlData = response
      }
    });

    let arr = await indicatorQnData.filter(item => {
      return (
        item.KODE_IKU == this.formData.ikuSelected &&
        item.TAHUN_INDICATOR == this.formData.yearPeriode &&
        item.PERIODE == this.formData.periodeSelected
      );
    });

    if (arr[0] != null) {
      let defaultValueSettings = {
        indikator1: "Indikator 1",
        realisasi1: "Realisasi 1",
      };

      if (arr[0].INDIKATOR_1_DESC != "") {
        defaultValueSettings.indikator1 = arr[0].INDIKATOR_1_DESC;
        defaultValueSettings.realisasi1 = arr[0].REALISASI_1_DESC;
      }

      this.settings = {
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
            title: defaultValueSettings.indikator1,
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
            title: defaultValueSettings.realisasi1,
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
            title: "Result",
            type: "number",
            filter: false,
            editable: false,
            width: "30%"
          },
          TARGET: {
            title: "Target",
            type: "number",
            filter: false,
            editable: true,
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

      this.formData.indicatorId = arr[0].KODE_INDIKATOR;
      this.formData.threshold = arr[0].THRESHOLD;


      this.formData.bankData.forEach(element => {
        let detail = {
          KODE_IKU: this.formData.ikuSelected,
          TAHUN_REALISASI: this.formData.yearPeriode,
          PERIODE: this.formData.periodeSelected,
          KODE_BANK: element.ID_BANK,
          NILAI_INDICATOR_1: 100,
          NILAI_INDICATOR_2: null,
          NILAI_INDICATOR_3: null,
          NILAI_REALISASI_1: 0,
          NILAI_REALISASI_2: null,
          NILAI_REALISASI_3: null,
          RESULT1: "0%",
          RESULT2: null,
          RESULT3: null,
          PENCAPAIAN: "0",
          USER_CREATED: "Admin",
          DATETIME_CREATED: moment().format(),
          USER_UPDATED: "Admin",
          DATETIME_UPDATED: moment().format(),
          DESC_BANK: element.DESCRIPTION,
          REMARK: null,
          TARGET: this.formData.threshold
        }

        let arrIndicatorDtlData = indicatorQnDtlData.filter(item => {
          return (
            item.KODE_IKU == this.formData.ikuSelected &&
            item.TAHUN_INDICATOR == this.formData.yearPeriode &&
            item.PERIODE == this.formData.periodeSelected &&
            item.KODE_BANK == element.ID_BANK
          );
        });

        if (arrIndicatorDtlData[0] != null) {
          detail.NILAI_INDICATOR_1 = arrIndicatorDtlData[0].NILAI_INDICATOR_1;
        }

        let arrRealizationDtlData = realizationQnDtlData.filter(item => {
          return (
            item.KODE_IKU == this.formData.ikuSelected &&
            item.TAHUN_REALISASI == this.formData.yearPeriode &&
            item.PERIODE == this.formData.periodeSelected &&
            item.KODE_BANK == element.ID_BANK
          );
        })

        if (arrRealizationDtlData[0] != null) {
          detail.NILAI_REALISASI_1 = arrRealizationDtlData[0].NILAI_REALISASI_1;
          detail.NILAI_REALISASI_2 = arrRealizationDtlData[0].NILAI_REALISASI_2;
          detail.NILAI_REALISASI_3 = arrRealizationDtlData[0].NILAI_REALISASI_3;
          detail.PENCAPAIAN = arrRealizationDtlData[0].PENCAPAIAN;

          if (arrRealizationDtlData[0].TARGET != null) {
            detail.TARGET = arrRealizationDtlData[0].TARGET;
          }


          if (arrRealizationDtlData[0].REMARK != null) {
            detail.REMARK = arrRealizationDtlData[0].REMARK;
          }
        }

        detail.RESULT1 = ((detail.NILAI_REALISASI_1 / detail.NILAI_INDICATOR_1) * 100).toFixed(2) + "%";
        detail.RESULT2 = ((detail.NILAI_REALISASI_2 / detail.NILAI_INDICATOR_2) * 100).toFixed(2) + "%";
        detail.RESULT3 = ((detail.NILAI_REALISASI_3 / detail.NILAI_INDICATOR_3) * 100).toFixed(2) + "%";

        if (detail.RESULT1 === "NaN%" || detail.RESULT1 === "Infinity%") {
          detail.RESULT1 = "0%"
        };
        if (detail.RESULT2 === "NaN%" || detail.RESULT2 === "Infinity%") {
          detail.RESULT2 = "0%"
        };
        if (detail.RESULT3 === "NaN%" || detail.RESULT3 === "Infinity%") {
          detail.RESULT3 = "0%"
        };
        realisasiDetail.push(detail);
      });

      realisasiDetail = realisasiDetail.sort(function (a, b) { return a.KODE_BANK - b.KODE_BANK });
      this.tabledata = realisasiDetail;
      this.formData.realisasiDetail = realisasiDetail;
      this.source.load(this.formData.realisasiDetail);
      this.source.refresh();
      console.log(this.tabledata)
      this.toastr.success("Get Data Sucess!")
    } else {
      this.tabledata = []
      this.formData.realisasiDetail = this.tabledata;
      this.source.load(this.formData.realisasiDetail);
      this.source.refresh();
      this.toastr.error("Data Indikator Belum di isi!")
    }
  }

  save() {
    let header = {
      KODE_IKU: this.formData.ikuSelected,
      TAHUN_REALISASI: this.formData.yearPeriode,
      PERIODE: this.formData.periodeSelected,
      KODE_INDIKATOR: this.formData.indicatorId,
      //PENCAPAIAN: 1,
      USER_CREATED: "Admin",
      DATETIME_CREATED: moment().format(),
      USER_UPDATED: "Admin",
      DATETIME_UPDATED: moment().format()
    };

    this.service.postreq("trn_realization_qns/crud", header).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log("indicator header");
        console.log(error);
      }
    );

    this.formData.realisasiDetail.forEach((element, ind) => {
      console.log(element)
      let headerdtl = {
        KODE_IKU: element.KODE_IKU,
        TAHUN_REALISASI: element.TAHUN_REALISASI,
        PERIODE: element.PERIODE,
        KODE_BANK: element.KODE_BANK,
        NILAI_REALISASI_1: element.NILAI_REALISASI_1,
        NILAI_REALISASI_2: null,
        NILAI_REALISASI_3: null,
        PENCAPAIAN: element.PENCAPAIAN.toString(),
        USER_CREATED: "admin",
        DATETIME_CREATED: moment().format(),
        USER_UPDATED: "admin",
        DATETIME_UPDATED: moment().format(),
        REMARK: null,
        TARGET: element.TARGET
      }

      if (element.NILAI_REALISASI_2 == 0) {
        headerdtl.NILAI_REALISASI_2 = element.NILAI_REALISASI_1
      }

      if (element.NILAI_REALISASI_3 == 0) {
        headerdtl.NILAI_REALISASI_3 = element.NILAI_REALISASI_1
      }

      this.service.postreq("trn_realization_qn_dtls/crud", headerdtl).subscribe(
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
  }

  editConfirm(event) {
    event.newData.RESULT1 =
      (
        (event.newData.NILAI_REALISASI_1 / event.newData.NILAI_INDICATOR_1) *
        100
      ).toFixed(2) + "%";
    event.newData.RESULT2 =
      (
        (event.newData.NILAI_REALISASI_2 / event.newData.NILAI_INDICATOR_2) *
        100
      ).toFixed(2) + "%";
    event.newData.RESULT3 =
      (
        (event.newData.NILAI_REALISASI_3 / event.newData.NILAI_INDICATOR_3) *
        100
      ).toFixed(2) + "%";

    if (event.data.TARGET == event.newData.TARGET) {
      console.log("data sama coy")

      if (parseInt(event.newData.RESULT1) >= event.data.TARGET) {
        event.newData.PENCAPAIAN = "1";
      } else {
        event.newData.PENCAPAIAN = "0";
      }

      event.confirm.resolve(event.newData);

    } else {
      console.log("data enggak sama")

      if (parseInt(event.newData.RESULT1) >= event.newData.TARGET) {
        event.newData.PENCAPAIAN = "1";
      } else {
        event.newData.PENCAPAIAN = "0";
      }

      if (event.newData.RESULT1 == "NaN%") {
        event.newData.RESULT1 = "0%"
      }
      if (event.newData.RESULT2 == "NaN%") {
        event.newData.RESULT2 = "0%"
      }
      if (event.newData.RESULT3 == "NaN%") {
        event.newData.RESULT3 = "0%"
      }
      event.confirm.resolve(event.newData);
    }
  }

}
