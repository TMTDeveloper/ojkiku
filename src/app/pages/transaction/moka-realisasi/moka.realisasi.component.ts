import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";
import { CustomEditorComponent } from "./CustomEditorComponent";

@Component({
  selector: "ngx-moka-realisasi",
  templateUrl: "./moka.realisasi.component.html",
  styles: [
    `
      input:disabled {
        background-color: rgba(211, 211, 211, 0.6);
      }
    `
  ]
})
export class MokaRealisasiComponent {
  @ViewChild("myForm")
  private myForm: NgForm;

  user: any;

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
      confirmSave: true
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
      edit: true,
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
      NO: {
        title: "NO",
        type: "number",
        filter: false,
        editable: false,
        width: "1%"
      },
      TIPE_DOKUMEN: {
        title: "Tipe Dokumen",
        type: "string",
        filter: false,
        editable: false,
        width: "3%"
      },
      ID_BANK: {
        title: "Bank",
        type: "string",
        filter: false,
        editable: false,
        width: "15%"
      },
      START_DATE: {
        title: "Start Date",
        type: "date",
        filter: false,
        editable: true,
        width: "5%"
      },
      TARGET_DATE: {
        title: "Target Date",
        type: "date",
        filter: false,
        editable: false,
        width: "5%"
      },
      REALIZATION_DATE: {
        title: "Realization Date",
        type: "string",
        filter: false,
        editable: true,
        width: "15%",
        editor: {
          type: "custom",
          component: CustomEditorComponent
        }
        //renderComponent: MokaRealisasiDatePicker
      },
      KETERANGAN: {
        title: "Keterangan",
        type: "string",
        filter: false,
        editable: true,
        width: "20%"
      },
      UPDATEBY_USER: {
        title: "Updated By",
        type: "string",
        filter: false,
        editable: false,
        width: "10%"
      },
      USER_REALIZATION: {
        title: "Updated",
        type: "string",
        filter: false,
        editable: false,
        width: "10%"
      }
    }
  };

  formData = {
    documentData: [],
    documentSelected: "",
    bankSelected: "",
    years: moment().format("YYYY"),
    threshold: 0,
    bankData: [],
    monaRealisasiData: []
  };

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    public service: BackendService,
    private authService: NbAuthService
  ) {
    this.loadData();
    this.getUserInfo();
    this.getUserBank();
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
          return item.FLAG == "Y";
        });
        if (documentFilter[0] != null) {
          this.formData.documentData = documentFilter;
        }
      }
    });
  }

  getUserBank() {
    if (this.user.ID_USER != "admin") {
      this.service
        .getreq("mst_user_banks")
        .toPromise()
        .then(response => {
          if (response != null) {
            let arr = response.filter(item => {
              return item.ID_USER == this.user.ID_USER;
            });
            console.log(arr);
            if (arr[0] != null) {
              this.user.type = arr[0].ID_BANK;
            }
            console.log(this.user.type);
            this.formData.bankData = this.formData.bankData.filter(item => {
              return item.ID_BANK == this.user.type;
            });
            this.formData.bankData.unshift({
              DATETIME_CREATED: "",
              DATETIME_UPDATED: "",
              DESCRIPTION: "",
              FLAG_ACTIVE: "",
              ID_BANK: "",
              INISIAL: "",
              USER_CREATED: "",
              USER_UPDATED: ""
            });
            console.log(this.formData.bankData);
          }
        });
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

  async getData() {
    console.log(this.formData);
    let monaTargetData: any[];
    let monaRealisasi: any[];

    await this.service
      .getreq("trn_monas")
      .toPromise()
      .then(resp => {
        if (resp != null) {
          monaTargetData = resp;
        }
      });

    await this.service
      .getreq("trn_mona_realizations")
      .toPromise()
      .then(res => {
        if (res != null) {
          monaRealisasi = res;
        }
      });

    let arrMonaTargetData = await monaTargetData.filter(items => {
      return (
        items.ID_BANK == this.formData.bankSelected &&
        items.TIPE_DOKUMEN == this.formData.documentSelected &&
        items.YEAR == this.formData.years
      );
    });

    if (arrMonaTargetData[0] != null) {
      let monaTargetdetail = [];

      await arrMonaTargetData.forEach((element, index) => {
        let detail = {
          NO: 1,
          KODE_BANK: 0,
          TIPE_DOKUMEN: "",
          ID_BANK: "",
          START_DATE: "",
          TARGET_DATE: "",
          REALIZATION_DATE: "",
          USER_REALIZATION: "",
          KETERANGAN: "",
          YEAR: 0,
          UPDATEBY_USER: ""
        };

        detail.NO = index + 1;
        detail.KODE_BANK = element.ID_BANK;
        detail.TIPE_DOKUMEN = element.TIPE_DOKUMEN;
        detail.YEAR = element.YEAR;
        detail.START_DATE = moment(element.START_DATE).format("DD/MM/YYYY");
        detail.TARGET_DATE = moment(element.TARGET_DATE).format("DD/MM/YYYY");

        let arrBank = this.formData.bankData.filter(item => {
          return item.ID_BANK == element.ID_BANK;
        });

        if (arrBank[0] != null) {
          detail.ID_BANK = arrBank[0].DESCRIPTION;
        }

        let arrs = monaRealisasi.filter(items => {
          return (
            items.ID_BANK == detail.KODE_BANK &&
            items.TIPE_DOKUMEN == detail.TIPE_DOKUMEN &&
            items.YEAR == detail.YEAR
          );
        });

        if (arrs[0] != null) {
          if (arrs[0].REALIZATION_DATE != null) {
            detail.REALIZATION_DATE = moment(arrs[0].REALIZATION_DATE).format(
              "DD/MM/YYYY"
            );
            detail.UPDATEBY_USER = arrs[0].UPDATEBY_USER;
          }

          detail.KETERANGAN = arrs[0].KETERANGAN;
          detail.USER_REALIZATION = arrs[0].USER_REALIZATION;
          console.log(detail);
        }
        monaTargetdetail.push(detail);
      });
      this.formData.monaRealisasiData = monaTargetdetail;
      this.tabledata = monaTargetdetail;
      this.source.load(this.tabledata);
      this.source.refresh();
    } else {
      this.toastr.error("Data Not Found!");
      this.tabledata = [];
      this.source.load(this.tabledata);
      this.source.refresh();
    }
  }

  updateData() {
    this.tabledata.forEach(element => {
      let header = {
        ID_BANK: element.KODE_BANK,
        YEAR: element.YEAR,
        TIPE_DOKUMEN: element.TIPE_DOKUMEN,
        KETERANGAN: element.KETERANGAN,
        USER_REALIZATION: "admin",
        REALIZATION_DATE: element.REALIZATION_DATE,
        USER_UPDATED: "admin",
        DATE_UPDATED: moment().format(),
        UPDATEBY_USER: element.UPDATEBY_USER
      };

      if (element.REALIZATION_DATE == "kosong") {
        header.REALIZATION_DATE = null;
      } else {
        header.REALIZATION_DATE = moment(
          this.dateReformat(element.REALIZATION_DATE)
        ).format();
      }
      this.service.postreq("trn_mona_realizations/crud", header).subscribe(
        response => {
          console.log(response);
          this.toastr.success("Data Saved!");
        },
        error => {
          this.toastr.error("Error, Cek kembali data!");
          console.log(error);
        }
      );
    });
  }

  editConfirm(event) {
    console.log(event.newData);
    event.confirm.resolve(event.newData);
  }

  submit(event) {
    // this.tabledata.forEach((element, ind) => {
    //   if (element.KODE_IKU == event.newData.KODE_IKU) {
    //     element.KODE_IKU = event.newData.KODE_IKU;
    //     element.DESKRIPSI = event.newData.DESKRIPSI;
    //     element.TIPE_IKU = event.newData.TIPE_IKU;
    //     this.service
    //       .patchreq("mst_ikus", this.tabledata[ind])
    //       .subscribe(response => {
    //         console.log(JSON.stringify(response));
    //         event.confirm.resolve(event.newData);
    //         this.toastr.success("Data Updated!");
    //       });
    //   }
    // });
    console.log(event.newData);
    event.newData.UPDATEBY_USER=this.user.USER_NAME
    event.confirm.resolve(event.newData);
  }

  dateReformat(value) {
    let str = value.split("/");
    return str[2] + "-" + str[1] + "-" + str[0];
  }
}
