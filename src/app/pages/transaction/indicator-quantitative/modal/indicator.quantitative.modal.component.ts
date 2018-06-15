import { LocalDataSource } from "ng2-smart-table";
import { Component, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BackendService } from "../../../../@core/data/backend.service";
@Component({
  selector: "ngx-indicator-quantitative-modal",
  templateUrl: "./indicator.quantitative.modal.component.html",
  styles: [`
  input:disabled {
    background-color: rgba(211,211,211, 0.6);
 }`]
})
export class IndicatorQuantitativeModalComponent {
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
    bankData: [],
    indicatorDetail: [],
    threshold: 0,
    indicator1: "",
    indicator2: "",
    indicator3: "",
    realisasi1: "",
    realisasi2: "",
    realisasi3: ""
  };
  source: LocalDataSource = new LocalDataSource();
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
      INDIKATOR_1_DESC: this.formData.indicator1,
      INDIKATOR_2_DESC: this.formData.indicator2,
      INDIKATOR_3_DESC: this.formData.indicator3,
      REALISASI_1_DESC: this.formData.realisasi1,
      REALISASI_2_DESC: this.formData.realisasi2,
      REALISASI_3_DESC: this.formData.realisasi3,
      USER_CREATED: "admin",
      DATETIME_CREATED: moment().format(),
      USER_UPDATED: "admin",
      DATETIME_UPDATED: moment().format()
    }
    this.service.postreq("trn_indicator_qns", header).subscribe(response => {
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

  loadData() {
    this.service.getreq("mst_banks").subscribe(response => {
      if (response != null) {
        this.formData.bankData = response;
        this.service.getreq("trn_realization_qn_dtls").subscribe(response => {
          if (response != null) {
            this.formData.bankData.forEach((element, ind) => {
              let arr = response.filter(item => {
                return (
                  item.KODE_IKU == this.formData.ikuSelected &&
                  item.TAHUN_REALISASI == this.formData.yearPeriode &&
                  item.PERIODE == this.formData.periodeSelected &&
                  item.KODE_BANK == element.ID_BANK
                );
              });
              console.log(arr);
              if (arr[0] == null) {
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
                this.formData.indicatorDetail.push(detail);
              } else {
                console.log(arr);
                let detail = {
                  KODE_IKU: this.formData.ikuSelected,
                  TAHUN_INDICATOR: this.formData.yearPeriode,
                  PERIODE: this.formData.periodeSelected,
                  KODE_BANK: element.ID_BANK,
                  NILAI_INDICATOR_1: arr[0].NILAI_REALISASI_1,
                  NILAI_INDICATOR_2: arr[0].NILAI_REALISASI_2,
                  NILAI_INDICATOR_3: arr[0].NILAI_REALISASI_3,
                  USER_CREATED: "Admin",
                  DATETIME_CREATED: moment().format(),
                  USER_UPDATED: "Admin",
                  DATETIME_UPDATED: moment().format(),
                  DESC_BANK: element.DESCRIPTION
                };
                this.formData.indicatorDetail.push(detail);
              }
            });
            let data = {
              indicatorDetail: this.formData.indicatorDetail,
              indicatorId:
                "FET" +
                this.formData.ikuSelected +
                this.formData.yearPeriode +
                this.formData.periodeSelected
            };
            this.activeModal.close(data);
          }
          // error => {
          //   console.log(error);
          // };
        });
      }
      // error => {
      //   console.log(error);
      // };
    });
  }

  refreshSelected(event) {
    // this.selectedData = event.data;
  }

  submit() { }

  closeModal() {
    this.activeModal.close();
  }
}
