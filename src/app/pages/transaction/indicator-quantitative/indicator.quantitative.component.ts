import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";
import { IndicatorQuantitativeModalComponent } from "./modal/indicator.quantitative.modal.component";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";

@Component({
  selector: "ngx-indicator-quantitative",
  templateUrl: "./indicator.quantitative.component.html",
  styles: [`
  input:disabled {
    background-color: rgba(211,211,211, 0.6);
 }`]
})

export class IndicatorQuantitativeComponent {
  @ViewChild("myForm") private myForm: NgForm;

  source: LocalDataSource = new LocalDataSource();

  user: any;
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
      DESC_BANK: {
        title: "Bank",
        type: "string",
        filter: false,
        editable: false,
        width: "25%"
      },
      NILAI_INDICATOR_1: {
        title: "Nilai 1",
        type: "number",
        filter: false,
        editable: true,
        width: "25%",
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
      USER_CREATED: {
        title: "Created By",
        type: "string",
        filter: false,
        editable: false,
        width: "25%"
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
    indicator1: "",
    indicator2: "",
    indicator3: "",
    realisasi1: "",
    realisasi2: "",
    realisasi3: "",
    remark: "",
    bankData: [],
    indicatorDetail: []
  };

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    public service: BackendService,
    private authService: NbAuthService
  ) {
    this.loadData();
    this.getUserInfo()
    this.getUserBank()
  }

  getUserBank() {
    if (this.user.ID_USER != "admin") {
      this.service.getreq("mst_user_banks").toPromise().then(response => {
        if (response != null) {
          let arr = response.filter(item => {
            return (
              item.ID_USER == this.user.ID_USER
            )
          })
          if (arr[0] != null) {
            this.user.type = arr[0].ID_BANK
            console.log(this.user)
          }
        }
      })
    } else {
      this.user.type = "admin";
    }
  }

  getUserInfo() {
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.user = token.getPayload(); // here we receive a payload from the token and assigne it to our `user` variable
      }
    });
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
        item.TIPE_IKU == "QUANTITATIVE"
      )
    });

    if (arr[0] != null) {
      this.formData.ikuData = arr;
    } else {
      this.toastr.error("Tidak Ditemukan IKU Qualitative Data")
    }
  }

  showModal() {
    this.activeModal = this.modalService.open(
      IndicatorQuantitativeModalComponent,
      {
        windowClass: "xlModal",
        container: "nb-layout",
        backdrop: "static"
      }
    );

    this.activeModal.componentInstance.formData.ikuData = this.formData.ikuData;
    this.activeModal.componentInstance.formData.periodeSelected = this.formData.periodeSelected;
    this.activeModal.componentInstance.formData.ikuSelected = this.formData.ikuSelected;
    this.activeModal.componentInstance.formData.yearPeriode = this.formData.yearPeriode;
    //
    this.activeModal.componentInstance.formData.threshold = this.formData.threshold;
    this.activeModal.componentInstance.formData.indicator1 = this.formData.indicator1;
    this.activeModal.componentInstance.formData.indicator2 = this.formData.indicator2;
    this.activeModal.componentInstance.formData.indicator3 = this.formData.indicator3;
    this.activeModal.componentInstance.formData.realisasi1 = this.formData.realisasi1;
    this.activeModal.componentInstance.formData.realisasi2 = this.formData.realisasi2;
    this.activeModal.componentInstance.formData.realisasi3 = this.formData.realisasi3;
    this.activeModal.componentInstance.formData.remark = this.formData.remark;
    //
    this.activeModal.result.then(
      async response => {
        console.log(response);
        if (response != null) {
          this.formData.ikuSelected = response.ikuSelected;
          this.formData.periodeSelected = response.periodeSelected;
          this.formData.yearPeriode = response.yearPeriode;
          this.getData();
        }
      },
      error => { }
    );
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

  getData() {
    let defaultTitle = {
      nilai1: "Nilai 1",
      nilai2: "Nilai 2",
      nilai3: "Nilai 3"
    };


    this.service.getreq("trn_indicator_qns").subscribe(response => {
      if (response != null) {
        let res = response.filter(item => {
          return (
            item.KODE_IKU == this.formData.ikuSelected &&
            item.TAHUN_INDICATOR == this.formData.yearPeriode &&
            item.PERIODE == this.formData.periodeSelected
          );
        });

        if (res[0] != null) {
          this.formData.indicator1 = res[0].INDIKATOR_1_DESC;
          this.formData.indicator2 = res[0].INDIKATOR_2_DESC;
          this.formData.indicator3 = res[0].INDIKATOR_3_DESC;
          this.formData.realisasi1 = res[0].REALISASI_1_DESC;
          this.formData.realisasi2 = res[0].REALISASI_2_DESC;
          this.formData.realisasi3 = res[0].REALISASI_3_DESC;
          this.formData.threshold = res[0].THRESHOLD;
          this.formData.indicatorId = res[0].KODE_INDIKATOR;
          this.formData.remark = res[0].REMARK;

          if (res[0].INDIKATOR_1_DESC != "") {
            defaultTitle.nilai1 = res[0].INDIKATOR_1_DESC;
          }

          if (res[0].INDIKATOR_2_DESC != "") {
            defaultTitle.nilai2 = res[0].INDIKATOR_2_DESC;
          }

          if (res[0].INDIKATOR_3_DESC != "") {
            defaultTitle.nilai3 = res[0].INDIKATOR_3_DESC;
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
              DESC_BANK: {
                title: "Bank",
                type: "string",
                filter: false,
                editable: false,
                width: "40%"
              },
              NILAI_INDICATOR_1: {
                title: defaultTitle.nilai1,
                type: "number",
                filter: false,
                editable: true,
                width: "60%",
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
              USER_CREATED: {
                title: "Created By",
                type: "string",
                filter: false,
                editable: false,
                width: "25%"
              }
            }
          };
          let duaColumn = {
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
              DESC_BANK: {
                title: "Bank",
                type: "string",
                filter: false,
                editable: false,
                width: "30%"
              },
              NILAI_INDICATOR_1: {
                title: defaultTitle.nilai1,
                type: "number",
                filter: false,
                editable: true,
                width: "35%",
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
              NILAI_INDICATOR_2: {
                title: defaultTitle.nilai2,
                type: "number",
                filter: false,
                editable: true,
                width: "35%",
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
              USER_CREATED: {
                title: "Created By",
                type: "string",
                filter: false,
                editable: false,
                width: "25%"
              }
            }
          };
          let tigaColumn = {
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
              DESC_BANK: {
                title: "Bank",
                type: "string",
                filter: false,
                editable: false,
                width: "20%"
              },
              NILAI_INDICATOR_1: {
                title: defaultTitle.nilai1,
                type: "number",
                filter: false,
                editable: true,
                width: "25%",
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
              NILAI_INDICATOR_2: {
                title: defaultTitle.nilai2,
                type: "number",
                filter: false,
                editable: true,
                width: "25%",
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
              NILAI_INDICATOR_3: {
                title: defaultTitle.nilai3,
                type: "number",
                filter: false,
                editable: true,
                width: "25%",
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
              USER_CREATED: {
                title: "Created By",
                type: "string",
                filter: false,
                editable: false,
                width: "25%"
              }
            }
          };


          if (res[0].INDIKATOR_2_DESC != "") {
            Object.assign(this.settings, duaColumn)
          }

          if (res[0].INDIKATOR_3_DESC != "") {
            Object.assign(this.settings, tigaColumn)
          }


          this.service.getreq("mst_banks").subscribe(response => {
            if (response != null) {
              this.formData.bankData = response;
              let indicatorDetail = [];
              this.service.getreq("trn_indicator_qn_dtls").subscribe(responseDtl => {
                if (responseDtl != null) {
                  this.formData.bankData.forEach((element, ind) => {
                    let arr = responseDtl.filter(item => {
                      return (
                        item.KODE_IKU == this.formData.ikuSelected &&
                        item.TAHUN_INDICATOR == this.formData.yearPeriode &&
                        item.PERIODE == this.formData.periodeSelected &&
                        item.KODE_BANK == element.ID_BANK
                      );
                    });

                    
                    if (arr[0] == null) {
                      console.log(arr);
                      let detail = {
                        KODE_IKU: this.formData.ikuSelected,
                        TAHUN_INDICATOR: this.formData.yearPeriode,
                        PERIODE: this.formData.periodeSelected,
                        KODE_BANK: element.ID_BANK,
                        NILAI_INDICATOR_1: 0,
                        NILAI_INDICATOR_2: 0,
                        NILAI_INDICATOR_3: 0,
                        USER_CREATED: this.user.USER_NAME,
                        DATETIME_CREATED: moment().format(),
                        USER_UPDATED: this.user.USER_NAME,
                        DATETIME_UPDATED: moment().format(),
                        DESC_BANK: element.DESCRIPTION
                      };
                      indicatorDetail.push(detail);
                    } else {
                      console.log(arr);
                      let detail = {
                        KODE_IKU: this.formData.ikuSelected,
                        TAHUN_INDICATOR: this.formData.yearPeriode,
                        PERIODE: this.formData.periodeSelected,
                        KODE_BANK: element.ID_BANK,
                        NILAI_INDICATOR_1: arr[0].NILAI_INDICATOR_1,
                        NILAI_INDICATOR_2: arr[0].NILAI_INDICATOR_2,
                        NILAI_INDICATOR_3: arr[0].NILAI_INDICATOR_3,
                        USER_CREATED: arr[0].USER_CREATED,
                        DATETIME_CREATED: moment().format(),
                        USER_UPDATED: this.user.USER_NAME,
                        DATETIME_UPDATED: moment().format(),
                        DESC_BANK: element.DESCRIPTION
                      };
                      indicatorDetail.push(detail);
                    }
                  });
                  indicatorDetail = indicatorDetail.sort(function (a, b) { return a.KODE_BANK - b.KODE_BANK });

                  console.log(this.user)

                  if (this.user.type != "admin") {
                    const dataBankFilter = indicatorDetail.filter(item => {
                      return (
                        item.KODE_BANK == this.user.type
                      );
                    });
                    console.log('gue ada disini nih')

                    if (dataBankFilter[0] != null) {
                      this.tabledata = dataBankFilter;
                      this.formData.indicatorDetail = dataBankFilter;
                      this.formData.indicatorId =
                        "RBB" +
                        this.formData.ikuSelected +
                        this.formData.yearPeriode +
                        this.formData.periodeSelected;
                      this.source.load(this.tabledata);
                    }
                  } else {
                    this.tabledata = indicatorDetail;
                    this.formData.indicatorDetail = indicatorDetail;
                    this.formData.indicatorId =
                      "RBB" +
                      this.formData.ikuSelected +
                      this.formData.yearPeriode +
                      this.formData.periodeSelected;
                    this.source.load(this.tabledata);
                  }
                }
              });
            }
          });
        } else {
          this.toastr.error("Data Not Found!");
        }
      }
    });
  }

  save() {
    let header = {
      KODE_IKU: this.formData.ikuSelected,
      TAHUN_INDICATOR: this.formData.yearPeriode,
      PERIODE: this.formData.periodeSelected,
      KODE_INDIKATOR: this.formData.indicatorId,
      THRESHOLD: this.formData.threshold,
      INDIKATOR_1_DESC: this.formData.indicator1,
      INDIKATOR_2_DESC: this.formData.indicator2,
      INDIKATOR_3_DESC: this.formData.indicator3,
      REALISASI_1_DESC: this.formData.realisasi1,
      REALISASI_2_DESC: this.formData.realisasi2,
      REALISASI_3_DESC: this.formData.realisasi3,
      USER_CREATED: this.user.USER_NAME,
      DATETIME_CREATED: moment().format(),
      USER_UPDATED: this.user.USER_NAME,
      DATETIME_UPDATED: moment().format()
    };
    this.service.postreq("trn_indicator_qns/crud", header).subscribe(
      response => {
        console.log(response);
        this.formData.indicatorDetail.forEach((element, ind) => {
          this.service.postreq("trn_indicator_qn_dtls/crud", element).subscribe(
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
}
