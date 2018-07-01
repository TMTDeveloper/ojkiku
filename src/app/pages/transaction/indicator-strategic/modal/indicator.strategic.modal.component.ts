import { LocalDataSource } from "ng2-smart-table";
import { Component, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BackendService } from "../../../../@core/data/backend.service";

@Component({
  selector: "ngx-indicator-strategic-modal",
  templateUrl: "./indicator.strategic.modal.component.html",
  styles: [`
  input:disabled {
    background-color: rgba(211,211,211, 0.6);
 }`]
})

export class IndicatorStrategicModalComponent {
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
    periodeSelected: "",
    ikuSelected: "",
    yearPeriode: moment().format("YYYY"),
    threshold: 0,
    indicatorDescription: "",
    realisasiDescription: "",
  };

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    public service: BackendService
  ) { }

  addNewData() {
    let header = {
      KODE_IKU: this.formData.ikuSelected,
      TAHUN_INDICATOR: this.formData.yearPeriode,
      PERIODE: this.formData.periodeSelected,
      KODE_INDIKATOR: "FET" +
        this.formData.ikuSelected +
        this.formData.yearPeriode +
        this.formData.periodeSelected,
      THRESHOLD: this.formData.threshold,
      INDIKATOR_1_DESC: this.formData.indicatorDescription,
      REALISASI_1_DESC: this.formData.realisasiDescription,
      INDIKATOR_2_DESC: null,
      REALISASI_2_DESC: null,
      INDIKATOR_3_DESC: null,
      REALISASI_3_DESC: null,
      USER_CREATED: "admin",
      DATETIME_CREATED: moment().format(),
      USER_UPDATED: "admin",
      DATETIME_UPDATED: moment().format(),
      REMARK: ""
    }
    console.log(header)
    this.service.postreq("trn_indicator_qns/crud", header).subscribe(response => {
      if (response != null){
        this.toastr.success("Data Added!")
        let data = {
          ikuSelected: this.formData.ikuSelected,
          periodeSelected: this.formData.periodeSelected,
          yearPeriode: this.formData.yearPeriode
        }
        this.activeModal.close(data);
      } else {
        this.toastr.error("Add Data Failed!")
      }
    });
  }

  closeModal() {
    this.activeModal.close();
  }
}
