import { LocalDataSource } from "ng2-smart-table";
import { Component, ViewChild } from "@angular/core";
import * as moment from "moment";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BackendService } from "../../../../@core/data/backend.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "ngx-detail-atk-modal",
  templateUrl: "./detail.atk.modal.component.html"
})
export class DetailAtkModalComponent {
  user: any;

  formData = {
    barang: "",
    merk: "",
    qty: 0,
    NO_SR: 0,
    NM_BARANG: "",
    NM_MERK: "",
    USER_TRANSACTION: ""
  };

  merk: any[] = [];
  barang: any[] = [];
  event: any;
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
    let data = {
      KD_ORDER: "",
      NO_SR: this.formData.NO_SR,
      NM_BARANG: this.formData.NM_BARANG,
      NM_MERK: this.formData.NM_MERK,
      QTY_BARANG: "",
      KD_BARANG: this.formData.barang,
      KD_MERK: this.formData.merk,
      SERIAL_NUMBER: "",
      QTY: this.formData.qty,
      STATUS: "BARU",
      USER_TRANSACTION: this.formData.USER_TRANSACTION,
      DATE_TIME_TRANSACTION: moment().format()
    };
    this.activeModal.close(data);
  }

  refreshSelected(event) {
    // this.selectedData = event.data;
  }

  closeModal() {
    this.activeModal.close();
  }
}
