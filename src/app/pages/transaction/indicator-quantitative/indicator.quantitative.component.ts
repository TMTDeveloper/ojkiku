import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";
import { IndicatorQuantitativeModalComponent } from "./modal/indicator.quantitative.modal.component";

@Component({
  selector: "ngx-indicator-quantitative",
  templateUrl: "./indicator.quantitative.component.html",
  styles: [`input:disabled {
    background-color: rgba(211,211,211, 0.6);
 }`]
})

export class IndicatorQuantitativeComponent {
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
        width: "25%"
      },
      NILAI_INDICATOR_2: {
        title: "Nilai 2",
        type: "number",
        filter: false,
        editable: true,
        width: "25%"
      },
      NILAI_INDICATOR_3: {
        title: "Nilai 3",
        type: "number",
        filter: false,
        editable: true,
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
    this.activeModal.componentInstance.formData.periodeSelectedParent = this.formData.periodeSelected;
    this.activeModal.componentInstance.formData.ikuSelectedParent = this.formData.ikuSelected;
    this.activeModal.componentInstance.formData.yearPeriodeParent = this.formData.yearPeriode;
    this.activeModal.result.then(
      async response => {
        console.log(response);
        if (response != null) {
          this.tabledata = response.indicatorDetail;
          this.formData.indicatorDetail = response.indicatorDetail;
          this.formData.indicatorId = response.indicatorId;
          this.source.load(this.tabledata);
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


  generateDetail() {
    this.service.getreq("mst_banks").subscribe(response => {
      if (response != null) {
        this.formData.bankData = response;
        let indicatorDetail = [];
        this.formData.bankData.forEach((element, ind) => {
          let detail = {
            KODE_IKU: this.formData.ikuSelected,
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
          this.formData.ikuSelected +
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
