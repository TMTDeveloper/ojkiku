import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";
import { IndicatorStrategicModalComponent } from "./modal/indicator.strategic.modal.component"

@Component({
  selector: "ngx-indicator-strategic",
  templateUrl: "./indicator.strategic.component.html",
  styles: [
    `
      input:disabled {
        background-color: rgba(211, 211, 211, 0.6);
      }
    `
  ]
})
export class IndicatorStrategicComponent {
  @ViewChild("myForm") private myForm: NgForm;

 
  activeModal: any;
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
    ikuData: [],
    ikuSelected: "",
    periodeSelected: "",
    yearPeriode: moment().format("YYYY"),
    
    indicatorDescription: "",
    realisasiDescription: "",
    threshold: 0,
    indicatorId: "",
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
      this.toastr.error("Tidak Ditemukan IKU Indicator Strategic Data")
    }
  }



  getData() {
    this.service.getreq("trn_indicator_qns").subscribe(response => {
      if(response != null){
        let arr = response.filter(item => {
          return (
            item.KODE_IKU == this.formData.ikuSelected &&
            item.TAHUN_INDICATOR == this.formData.yearPeriode &&
            item.PERIODE == this.formData.periodeSelected
          )
        });
        if(arr[0] != null){
          this.formData.indicatorDescription = arr[0].INDIKATOR_1_DESC;
          this.formData.realisasiDescription = arr[0].REALISASI_1_DESC;
          this.formData.threshold = arr[0].THRESHOLD;
          this.formData.indicatorId = "FET" +
          this.formData.ikuSelected +
          this.formData.yearPeriode +
          this.formData.periodeSelected;
          this.toastr.success("Get Data Success!")
        } else {
          this.toastr.error("No Data!")
        }
      }
    });
  }

  showModal() {
    this.activeModal = this.modalService.open(
      IndicatorStrategicModalComponent,
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

    this.activeModal.componentInstance.formData.threshold = this.formData.threshold;
    this.activeModal.componentInstance.formData.indicatorDescription = this.formData.indicatorDescription;
    this.activeModal.componentInstance.formData.realisasiDescription = this.formData.realisasiDescription;

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
}
