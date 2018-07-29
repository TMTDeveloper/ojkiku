import { LocalDataSource } from "ng2-smart-table";
import { Component, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal, NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { BackendService } from "../../../../@core/data/backend.service";

@Component({
  selector: "ngx-moka-target-modal",
  templateUrl: "./moka.target.modal.component.html",
  styles: [`
  input:disabled {
    background-color: rgba(211,211,211, 0.6);
 }`]
})


export class MokaTargetModalComponent {
  formData = {
    documentData: [],
    documentSelected: "",
    bankSelected: "",
    startDate: "",
    targetDate: "",
    keterangan: "",
    year: moment().format("YYYY"),
    bankData: [],
  };
  source: LocalDataSource = new LocalDataSource();
  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    public service: BackendService
  ) { }

  dateReformat(value) {
    return value.year + "-" + value.month + "-" + value.day
  }

  addNewData() {
    
    let header = {
      YEAR: moment(this.dateReformat(this.formData.startDate)).format("YYYY"),
      ID_BANK: this.formData.bankSelected,
      TIPE_DOKUMEN: this.formData.documentSelected,
      KETERANGAN: this.formData.keterangan,
      START_DATE: moment(this.dateReformat(this.formData.startDate)).format(),
      TARGET_DATE: moment(this.dateReformat(this.formData.targetDate)).format(),
      USER_CREATED: "admin",
      DATE_CREATED: moment().format(),
      USER_UPDATED: "admin",
      DATE_UPDATED: moment().format(),
    }
    this.service.postreq("trn_monas/crud", header).subscribe(response => {
      if (response != null) {
        this.toastr.success("Data Added!")
        let data = {
          yearPeriode: this.formData.startDate
        }
        this.activeModal.close(data);
      } else {
        this.toastr.error("Add Data Failed!")
      }
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
