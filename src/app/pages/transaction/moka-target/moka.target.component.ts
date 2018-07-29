import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";
import { MokaTargetModalComponent } from "./modal/moka.target.modal.component";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";


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

  user: any;

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
    years: moment().format("YYYY"),
    bankData: [],
    documentData: [],
    monaDataDetail: []
  };

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    public service: BackendService,
    private authService: NbAuthService
  ) {
    this.loadData();
    this.getUserInfo()
    this.getUserBank()
  }

  loadData() {
    this.service.getreq("mst_banks").subscribe(response => {
      if (response != null) {
        this.formData.bankData = response;
      }
    });
    this.service.getreq("mst_documents").subscribe(response => {
      if (response != null) {
        let documentFilter = response.filter(item => {
          return (
            item.FLAG == 'Y'
          )
        });
        if (documentFilter[0] != null){
          this.formData.documentData = documentFilter
        }
      }
    });
  }

  getUserBank() {
    if (this.user.ID_USER != "admin") {
      this.service.getreq("mst_user_banks").toPromise().then(response => {
        if (response != null) {
          let arr = response.filter(item => {
            return (
              item.ID_USER == this.user.ID_USER
            )
          });
          if (arr[0] != null) {
            this.user.type = arr[0].ID_BANK
          }

          this.formData.bankData = this.formData.bankData.filter(item => {
            return (item.ID_BANK == this.user.type)
          })
        }
      })
    } else {
      this.user.type = "admin";
    }
  }

  getUserInfo() {
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.user = token.getPayload(); // here we receive a payload from the token and assigne it to our `user` variable
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
    this.activeModal.componentInstance.formData.documentData = this.formData.documentData;
    this.activeModal.result.then((result) => {
      this.getData()
    }, (reason) => {
      this.getData()
    });

  }



  getData() {
    this.service.getreq("trn_monas").subscribe(response => {
      if (response != null) {
        console.log(response)
        let res = response.filter(item => {
          return (
            item.YEAR == this.formData.years &&
            item.ID_BANK == this.user.type
          );
        });
        if (this.user.type == 'admin') {
          res = response.filter(item => {
            return (
              item.YEAR == this.formData.years
            );
          });
        }
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
                TIPE_DOKUMEN: element.TIPE_DOKUMEN,
                ID_BANK: arr[0].DESCRIPTION,
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
