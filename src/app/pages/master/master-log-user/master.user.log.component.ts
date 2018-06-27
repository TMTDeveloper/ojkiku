import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";


@Component({
  selector: "ngx-master-user-log",
  templateUrl: "./master.user.log.component.html"
})
export class MasterUserLogComponent {
  @ViewChild("myForm") private myForm: NgForm;

  source: LocalDataSource = new LocalDataSource();

  tabledata: any[] = [];
  yearPeriode: string = moment().format("YYYY");
  subscription: any;
  activeModal: any;
  settings = {
    mode: "inline",
    sort: true,
    hideSubHeader: true,
    actions: {
      add: false,
      edit: false,
      delete: false,
      width: "10%"
    },
    pager: {
      display: true,
      perPage: 30
    },
    columns: {
      USERNAME: {
        title: "Username",
        type: "string",
        filter: false,
        editable: false,
        width: "50%"
      },
      DATETIME_LOGIN: {
        title: "Datetime Login",
        type: "number",
        filter: false,
        editable: true,
        width: "50%"
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
    this.service.getreq("LOGIN_LOGs").subscribe(response => {
      if (response != null) {
        this.tabledata = response;
        console.log(JSON.stringify(response));
        this.source.load(this.tabledata);
      }
    });
  }

}
