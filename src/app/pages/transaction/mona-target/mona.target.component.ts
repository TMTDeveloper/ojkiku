import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";
import { MonaTargetModalComponent } from "./modal/mona.target.modal.component";


     
@Component({
  selector: "ngx-mona-target",
  templateUrl: "./mona.target.component.html",
  styles: [`
  input:disabled {
    background-color: rgba(211,211,211, 0.6);
 }`]
})

export class MonaTargetComponent {
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
      NILAI_INDICATOR_2: {
        title: "Nilai 2",
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
        title: "Nilai 3",
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
      }
    }
  };

  formData = {
    documentData: [
      {
        id: "RBP",
        desc: "Triwulan 1"
      },
      {
        id: "Lain-lain",
        desc: "Triwulan 2"
      }
    ],
    periodeSelected: "",
    documentSelected: "",
    bankSelected: "",
    yearPeriode: moment().format("YYYY"),
    startDate: "",
    targetDate: "",
    ikuData: [],
    threshold: 0,
    indicatorId: "",
    indicator1: "",
    indicator2: "",
    indicator3: "",
    realisasi1: "",
    realisasi2: "",
    realisasi3: "",
    bankData: [],
    indicatorDetail: []
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
      }
    });
    this.service.getreq("mst_banks").subscribe(response => {
      if (response != null) {
        this.formData.bankData = response;
      }
    });
  }

  showModal() {
    this.activeModal = this.modalService.open(
      MonaTargetModalComponent,
      {
        windowClass: "xlModal",
        container: "nb-layout",
        backdrop: "static"
      }
    );

    this.activeModal.componentInstance.formData.ikuData = this.formData.ikuData;
    this.activeModal.componentInstance.formData.periodeSelected = this.formData.periodeSelected;
    
    this.activeModal.componentInstance.formData.yearPeriode = this.formData.yearPeriode;
    this.activeModal.result.then(
      async response => {
        console.log(response);
        if (response != null) {
          
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
    this.service.getreq("trn_indicator_qns").subscribe(response => {
      if (response != null) {
        let res = response.filter(item => {
          return (
            
            item.TAHUN_INDICATOR == this.formData.yearPeriode &&
            item.PERIODE == this.formData.periodeSelected
          );
        });
        if (res[0] != null) {
          this.formData.indicator1 = res[0].INDIKATOR_1_DESC
          this.formData.indicator2 = res[0].INDIKATOR_2_DESC
          this.formData.indicator3 = res[0].INDIKATOR_3_DESC
          this.formData.realisasi1 = res[0].REALISASI_1_DESC
          this.formData.realisasi2 = res[0].REALISASI_2_DESC
          this.formData.realisasi3 = res[0].REALISASI_3_DESC
          this.formData.threshold = res[0].THRESHOLD
          this.formData.indicatorId = res[0].KODE_INDIKATOR

          this.service.getreq("mst_banks").subscribe(response => {
            if (response != null) {
              this.formData.bankData = response;
              let indicatorDetail = [];
              this.service.getreq("trn_indicator_qn_dtls").subscribe(responseDtl => {
                if (responseDtl != null) {
                  this.formData.bankData.forEach((element, ind) => {
                    let arr = responseDtl.filter(item => {
                      return (
                        
                        item.TAHUN_INDICATOR == this.formData.yearPeriode &&
                        item.PERIODE == this.formData.periodeSelected &&
                        item.KODE_BANK == element.ID_BANK
                      );
                    });
                    if (arr[0] == null) {
                      console.log(arr);
                      let detail = {
                        
                        TAHUN_INDICATOR: this.formData.yearPeriode,
                        PERIODE: this.formData.periodeSelected,
                        KODE_BANK: element.ID_BANK,
                        NILAI_INDICATOR_1: 0,
                        NILAI_INDICATOR_2: 0,
                        NILAI_INDICATOR_3: 0,
                        USER_CREATED: "Admin",
                        DATETIME_CREATED: moment().format(),
                        USER_UPDATED: "Admin",
                        DATETIME_UPDATED: moment().format(),
                        DESC_BANK: element.DESCRIPTION
                      };
                      indicatorDetail.push(detail);
                    } else {
                      console.log(arr);
                      let detail = {
                        
                        TAHUN_INDICATOR: this.formData.yearPeriode,
                        PERIODE: this.formData.periodeSelected,
                        KODE_BANK: element.ID_BANK,
                        NILAI_INDICATOR_1: arr[0].NILAI_INDICATOR_1,
                        NILAI_INDICATOR_2: arr[0].NILAI_INDICATOR_2,
                        NILAI_INDICATOR_3: arr[0].NILAI_INDICATOR_3,
                        USER_CREATED: "Admin",
                        DATETIME_CREATED: moment().format(),
                        USER_UPDATED: "Admin",
                        DATETIME_UPDATED: moment().format(),
                        DESC_BANK: element.DESCRIPTION
                      };
                      indicatorDetail.push(detail);
                    }
                  })
                  this.tabledata = indicatorDetail;
                  this.formData.indicatorDetail = indicatorDetail;
                  this.formData.indicatorId =
                    "RBB" +
                    
                    this.formData.yearPeriode +
                    this.formData.periodeSelected;
                  this.source.load(this.tabledata);
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

  generateDetail() {
    this.service.getreq("mst_banks").subscribe(response => {
      if (response != null) {
        this.formData.bankData = response;
        let indicatorDetail = [];
        this.formData.bankData.forEach((element, ind) => {
          let detail = {
            
            TAHUN_INDICATOR: this.formData.yearPeriode,
            PERIODE: this.formData.periodeSelected,
            KODE_BANK: element.ID_BANK,
            NILAI_INDICATOR_1: 0,
            NILAI_INDICATOR_2: 0,
            NILAI_INDICATOR_3: 0,
            USER_CREATED: "Admin",
            DATETIME_CREATED: moment().format(),
            USER_UPDATED: "Admin",
            DATETIME_UPDATED: moment().format(),
            DESC_BANK: element.DESCRIPTION
          };
          indicatorDetail.push(detail);
        });
        this.tabledata = indicatorDetail;
        this.formData.indicatorDetail = indicatorDetail;
        this.formData.indicatorId =
          "RBB" +
          
          this.formData.yearPeriode +
          this.formData.periodeSelected;
        this.source.load(this.tabledata);
      }
      // error => {
      //   console.log(error);
      // };
    });
  }

  save() {
    let header = {
      
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
      USER_CREATED: "Admin",
      DATETIME_CREATED: moment().format(),
      USER_UPDATED: "Admin",
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
