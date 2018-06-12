import { LocalDataSource } from "ng2-smart-table";
import { Component, ViewChild } from "@angular/core";
import * as moment from "moment";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BackendService } from "../../../../@core/data/backend.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "ngx-indicator-qualitative-modal",
  templateUrl: "./indicator.qualitative.modal.component.html"
})
export class IndicatorQualitativeModalComponent {
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
    tipeData: [
      {
        id: "string",
        desc: "String"
      },
      {
        id: "date",
        desc: "Date"
      },
      {
        id: "number",
        desc: "Number"
      }
    ],
    periodeSelected: "",
    tipeDataSelected: "",
    ikuData: [],
    ikuSelected: "",
    noDetail: 1,
    yearPeriode: moment().format("YYYY"),
    descriptionIndicator: "",
    indicatorQualitativeData: []
  };
  source: LocalDataSource = new LocalDataSource();
  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    public service: BackendService
  ) {}


  generateDetail() {
    this.service.getreq("trn_indicator_qls").subscribe(response => {
      if (response != null) {
        let arr = response.filter(item => {
          return (
            item.KODE_IKU == this.formData.ikuSelected &&
            item.TAHUN_INDICATOR == this.formData.yearPeriode &&
            item.PERIODE == this.formData.periodeSelected
          )
        })
        
        if(Array.isArray(arr) && arr.length){
          this.formData.noDetail = arr.length + 1;
        } 
        let header = {
          KODE_IKU: this.formData.ikuSelected,
          TAHUN_INDICATOR: this.formData.yearPeriode,
          PERIODE: this.formData.periodeSelected,
          NO_DETAIL: this.formData.noDetail,
          TIPE_DATA: this.formData.tipeDataSelected,
          DESKRIPSI: this.formData.descriptionIndicator,
          USER_CREATED: "Admin",
          DATETIME_CREATED: moment().format(),
          USER_UPDATED: "Admin",
          DATETIME_UPDATED: moment().format()
        };
        this.service.postreq("trn_indicator_qls/crud", header).subscribe(response => {
          if (response != null){
            //console.log(response)
          }
        });
        this.formData.noDetail = 1;

        this.generateTable()
      }
    });
  }

  generateTable() {
    this.service.getreq("trn_indicator_qls").subscribe(response => {
      if (response != null) {
        let arr = response.filter(item => {
          return (
            item.KODE_IKU == this.formData.ikuSelected &&
            item.TAHUN_INDICATOR == this.formData.yearPeriode &&
            item.PERIODE == this.formData.periodeSelected
          )
        })
        if (arr[0] != null) {
          let data = {
            ikuSelected: this.formData.ikuSelected,
            yearPeriode: this.formData.yearPeriode,
            periodeSelected: this.formData.periodeSelected,
            indicatorQualitativeData: arr
          }
          this.formData.indicatorQualitativeData = arr;
          this.toastr.success("New Data Added!");
          this.activeModal.close(data);
        } else {
          let data = {
            ikuSelected: this.formData.ikuSelected,
            yearPeriode: this.formData.yearPeriode,
            periodeSelected: this.formData.periodeSelected
          }
          this.toastr.error("Data Not Found!");
          this.activeModal.close(data);
        }
      }
    });
  }

  refreshSelected(event) {
    // this.selectedData = event.data;
  }


  closeModal() {
    this.activeModal.close();
  }
}
