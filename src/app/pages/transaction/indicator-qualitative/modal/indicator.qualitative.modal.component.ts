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
  user : any;

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


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  saveData() {
    this.service.getreq("trn_indicator_qls").subscribe(response => {
      if (response != null) {
        let arr = response.filter(item => {
          return (
            item.KODE_IKU == this.formData.ikuSelected &&
            item.TAHUN_INDICATOR == this.formData.yearPeriode &&
            item.PERIODE == this.formData.periodeSelected
          )
        })
        
        if(arr[0] != null){
          this.formData.noDetail = arr.length + 1;
        } else {
          this.formData.noDetail = 1
        }
        let header = {
          KODE_IKU: this.formData.ikuSelected,
          TAHUN_INDICATOR: this.formData.yearPeriode,
          PERIODE: this.formData.periodeSelected,
          NO_DETAIL: this.formData.noDetail,
          TIPE_DATA: this.formData.tipeDataSelected,
          DESKRIPSI: this.formData.descriptionIndicator,
          USER_CREATED: this.user.USER_NAME,
          DATETIME_CREATED: moment().format(),
          USER_UPDATED: this.user.USER_NAME,
          DATETIME_UPDATED: moment().format()
        };
        this.service.postreq("trn_indicator_qls/crud", header).subscribe(response => {
          if (response != null){
            console.log(response)
          }
        });
        this.toastr.success("New Data Added!");
        let data = {
          ikuSelected: this.formData.ikuSelected,
          yearPeriode: this.formData.yearPeriode,
          periodeSelected: this.formData.periodeSelected
        };
        this.activeModal.close(data);
        
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
          let indicatorQualitativeModalData = [];
          arr.forEach((element, ind) => {
            element.NO_DETAIL = ind + 1
            indicatorQualitativeModalData.push(element)
            });
          let data = {
            ikuSelected: this.formData.ikuSelected,
            yearPeriode: this.formData.yearPeriode,
            periodeSelected: this.formData.periodeSelected,
            indicatorQualitativeData: indicatorQualitativeModalData
          }
          this.formData.indicatorQualitativeData = indicatorQualitativeModalData;
          this.toastr.success("New Data Added!");
          this.activeModal.close(data);
        } else {
          let data = {
            ikuSelected: this.formData.ikuSelected,
            yearPeriode: this.formData.yearPeriode,
            periodeSelected: this.formData.periodeSelected,
            indicatorQualitativeData: []
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
