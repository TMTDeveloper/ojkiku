import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";
@Component({
  selector: "ngx-master-user",
  templateUrl: "./master.user.component.html"
})
export class MasterUserComponent {
  @ViewChild("myForm") private myForm: NgForm;

  source: LocalDataSource = new LocalDataSource();

  tabledata: any[] = [];
  yearPeriode: string = moment().format("YYYY");
  subscription: any;
  activeModal: any;
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
        width: "30%"
      },
      USER_NAME: {
        title: "Name",
        type: "number",
        filter: false,
        editable: true,
        width: "30%"
      },
      TEAM: {
        title: "Team",
        type: "number",
        filter: false,
        editable: true,
        width: "30%"
      },
      JABATAN: {
        title: "Jabatan",
        type: "number",
        filter: false,
        editable: true,
        width: "30%"
      },
      PASSWORD: {
        title: "Password",
        type: "number",
        filter: false,
        editable: true,
        width: "30%"
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
  loadData() {
    this.service.getreq("mst_users").subscribe(response => {
      if (response != null) {
        this.tabledata = response;
        console.log(JSON.stringify(response));
        this.source.load(this.tabledata);
      }
    });
  }

  submit(event) {
    this.tabledata.forEach((element, ind) => {
      if (element.ID_USER == event.newData.ID_USER) {
        element.USER_NAME = event.newData.USER_NAME;
        element.PASSWORD = event.newData.PASSWORD;
        element.TEAM = event.newData.TEAM;
        element.JABATAN = event.newData.JABATAN;
        this.service
          .patchreq("mst_users", event.newData)
          .subscribe(response => {
            console.log(JSON.stringify(response));
            event.confirm.resolve(event.newData);
            this.toastr.success("Data Updated!");
          });
      }
    });
  }
  addData(event) {
    console.log(event.newData);
    let data = {
      ID_USER: event.newData.ID_USER,
      USER_NAME: event.newData.USER_NAME,
      PASSWORD: event.newData.PASSWORD,
      TEAM: event.newData.TEAM,
      JABATAN: event.newData.JABATAN,
      USER_CREATED: "Admin",
      DATETIME_CREATED: moment().format(),
      USER_UPDATED: "Admin",
      DATETIME_UPDATED: moment().format()
    };

    this.tabledata.push(data);
    this.service.postreq("mst_users", data).subscribe(response => {
      console.log(response);
      event.confirm.resolve(event.newData);
      this.toastr.success("Data Saved!");
    });
  }
}
