import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";
import { MokaTargetModalComponent } from "./modal/moka.target.modal.component";



@Component({
  selector: "ngx-moka-target",
  templateUrl: "./moka.target.component.html",
  styles: [`
  input:disabled {
    background-color: rgba(211,211,211, 0.6);
 }`]
})

export class MokaTargetComponent {
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
      TIPE_DOKUMEN: {
        title: "Tipe Dokumen",
        type: "string",
        filter: false,
        editable: false,
        width: "15%"
      },
      ID_BANK: {
        title: "Bank",
        type: "string",
        filter: false,
        editable: false,
        width: "20%"
      },
      START_DATE: {
        title: "Start Date",
        type: "date",
        filter: false,
        editable: true,
        width: "15%"
      },
      TARGET_DATE: {
        title: "Target Date",
        type: "date",
        filter: false,
        editable: true,
        width: "15%",
      },
      KETERANGAN: {
        title: "Keterangan",
        type: "string",
        filter: false,
        editable: true,
        width: "35%",
      },
    }
  };

  formData = {
    documentData: [
      {
        id: "rbp",
        desc: "RBP"
      },
      {
        id: "lainlain",
        desc: "Lain-lain"
      }
    ],
    years: moment().format("YYYY"),
    bankData: [],
    monaDataDetail: []
  };

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    public service: BackendService
  ) {
    this.loadData();
  }

  loadData() {
    this.service.getreq("mst_banks").subscribe(response => {
      if (response != null) {
        this.formData.bankData = response;

      }
    });
  }

  showModal() {
    this.activeModal = this.modalService.open(
      MokaTargetModalComponent,
      {
        windowClass: "xlModal",
        container: "nb-layout",
        backdrop: "static"
      }
    )
    this.activeModal.componentInstance.formData.bankData = this.formData.bankData;

    this.activeModal.result.then((result) => {
      this.getData()
    }, (reason) => {
      this.getData()
    });
    
  }



  getData() {
    this.service.getreq("trn_monas").subscribe(response => {
      if (response != null) {
        let res = response.filter(item => {
          return (
            item.YEAR == this.formData.years &&
            item.REALIZATION_DATE == null
          );
        });
        let monaTargetdetail = [];
        if (res[0] != null) {
          res.forEach(element => {
            let arr = this.formData.bankData.filter(item => {
              return (
                item.ID_BANK == element.ID_BANK
              );
            });
            let detail = {};
            if (arr[0] != null) {
              detail = {
                TIPE_DOKUMEN : element.TIPE_DOKUMEN,
                ID_BANK : arr[0].DESCRIPTION,
                START_DATE: moment(element.START_DATE).format("DD MMMM YYYY"),
                TARGET_DATE: moment(element.TARGET_DATE).format("DD MMMM YYYY"),
                KETERANGAN: element.KETERANGAN
              }
              monaTargetdetail.push(detail);
            }
          });
          this.toastr.success("Get Data Success!")
          this.formData.monaDataDetail = monaTargetdetail;
          this.tabledata = monaTargetdetail;
          this.source.load(this.tabledata);
          this.source.refresh();

        }
        else {
          this.toastr.error("Data Not Found!")
          this.tabledata = []
          this.source.load(this.tabledata);
          this.source.refresh();
        }
      }
    });
  }

  save() {
    console.log("SAVE")
  }

  submit(event) {
    console.log("Submited")
  }

}
