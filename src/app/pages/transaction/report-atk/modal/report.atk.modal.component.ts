import { LocalDataSource } from "ng2-smart-table";
import { Component, ViewChild } from "@angular/core";
import * as moment from "moment";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BackendService } from "../../../../@core/data/backend.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "ngx-report-atk-modal",
  templateUrl: "./report.atk.modal.component.html"
})
export class ReportAtkModalComponent {
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
  tabledata: any[] = [];
  dataSource: any[] = [];
  subscription: any;
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
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: false
    },
    mode: "external",
    sort: true,
    hideSubHeader: true,
    actions: {
      add: false,
      edit: false,
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
      NO_SR: {
        title: "No",
        type: "number",
        filter: false,
        editable: false,
        width: "10%"
      },
      NM_BARANG: {
        title: "Nama Barang",
        type: "string",
        filter: true,
        editable: false,
        width: "30%"
      },
      NM_MERK: {
        title: "Nama Merk",
        type: "string",
        filter: true,
        editable: false,
        width: "30%"
      },
      QTY: {
        title: "Qty Order",
        type: "string",
        filter: false,
        editable: true,
        width: "15%"
      }
    }
  };
  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    public service: BackendService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.source.load(this.dataSource);
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
