import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";

@Component({
  selector: "ngx-master-user-bank",
  templateUrl: "./master.user.bank.component.html"
})
export class MasterUserBankComponent {
  @ViewChild("myForm")
  private myForm: NgForm;

  source: LocalDataSource = new LocalDataSource();

  tabledata: any[] = [];
  bankData: any[] = [];
  userData: any[] = [];
  userList: any[] = [];
  formData = {
    bank: ""
  };
  yearPeriode: string = moment().format("YYYY");
  subscription: any;
  activeModal: any;
  settingsTemplate = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true
    },
    mode: "inline",
    sort: true,
    hideSubHeader: false,
    actions: {
      add: true,
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
      ID_USER: {
        title: "Id User",
        type: "string",
        filter: true,
        editable: false,
        editor: {
          type: "list",
          config: {
            list: this.userList
          }
        },
        width: "70%"
      },
      FLAG_ACTIVE: {
        title: "Flag Active",
        type: "html",
        width: "20%",
        editor: {
          type: "list",
          config: {
            list: [{ value: "Y", title: "Y" }, { value: "N", title: "N" }]
          }
        }
      }
    }
  };
  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true
    },
    mode: "inline",
    sort: true,
    hideSubHeader: false,
    actions: {
      add: true,
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
      ID_USER: {
        title: "Id User",
        type: "string",
        filter: false,
        editable: false,
        editor: {
          type: "list",
          config: {
            list: this.userList
          }
        },
        width: "70%"
      },
      FLAG_ACTIVE: {
        title: "Flag Active",
        type: "html",
        width: "20%",
        editor: {
          type: "list",
          config: {
            list: [{ value: "Y", title: "Y" }, { value: "N", title: "N" }]
          }
        }
      }
    }
  };

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    public service: BackendService
  ) {
    this.loadData();
  }
  loadData(bank?) {
    this.service.getreq("mst_user_banks").subscribe(response => {
      if (response != null) {
        this.tabledata = response;
        console.log(JSON.stringify(response));

        this.service.getreq("mst_users").subscribe(response => {
          if (response != null) {
            this.userData = response;
            this.userData.forEach((element, ind) => {
              this.tabledata.forEach((item, index) => {
                element.ID_USER == item.ID_USER
                  ? (this.tabledata[index].USER_NAME = element.USER_NAME)
                  : null;
              });

              this.userList.push({
                value: element.ID_USER,
                title: element.ID_USER + " " + element.USER_NAME
              });
            });
            this.source.load(this.tabledata);

            console.log(this.userList);
            this.settings = this.settingsTemplate;
            console.log(JSON.stringify(response));

            this.service.getreq("mst_banks").subscribe(response => {
              if (response != null) {
                this.bankData = response;
                this.formData.bank =
                  bank != null ? bank : this.bankData[0].ID_BANK;
                console.log(JSON.stringify(response));
                this.reload();
              }
            });
          }
        });
      }
    });
  }

  submit(event) {
    this.tabledata.forEach((element, ind) => {
      if (
        element.ID_USER == event.newData.ID_USER &&
        element.ID_BANK == event.newData.ID_BANK
      ) {
        element.FLAG_ACTIVE = event.newData.FLAG_ACTIVE;
        element.DATETIME_UPDATED = moment().format();
        this.service
          .postreq("mst_user_banks/crud", this.tabledata[ind])
          .subscribe(response => {
            console.log(JSON.stringify(response));
            event.confirm.resolve(event.newData);
            this.toastr.success("Data Updated!");
          });
      }
    });
  }
  reload() {
    console.log("masuksini");
    this.source.addFilter({ field: "ID_BANK", search: this.formData.bank });
  }
  addData(event) {
    console.log(event.newData);
    let data = {
      ID_BANK: this.formData.bank,
      ID_USER: event.newData.ID_USER,
      FLAG_ACTIVE: event.newData.FLAG_ACTIVE,
      USER_NAME: this.userData.filter(item => {
        return item.ID_USER == event.newData.ID_USER;
      })[0].USER_NAME,
      USER_CREATED: "Admin",
      DATETIME_CREATED: moment().format(),
      USER_UPDATED: "Admin",
      DATETIME_UPDATED: moment().format()
    };

    if (
      this.tabledata.filter(item => {
        return (
          item.ID_USER == event.newData.ID_USER &&
          item.ID_BANK == this.formData.bank
        );
      })[0] == null
    ) {
      this.service.postreq("mst_user_banks", data).subscribe(response => {
        console.log(response);
        if (response != null) {
          this.source.reset();
          this.reload();
          this.toastr.success("Data Saved!");
          console.log(this.formData);
          event.confirm.resolve(data);
          this.source.load([{}]);
          this.loadData(data.ID_BANK);
        }
      });
    } else {
      event.confirm.reject();
      this.toastr.error("Data Already Exist!");
    }
  }
}
