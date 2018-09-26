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
  templateUrl: "./master.log.moni.component.html"
})
export class MasterLogMoniComponent {
  @ViewChild("myForm")
  private myForm: NgForm;

  source: LocalDataSource = new LocalDataSource();

  tabledata: any[] = [];
  yearPeriode: string = moment().format("YYYY");
  subscription: any;
  activeModal: any;
  settings = {
    mode: "inline",
    sort: true,
    hideSubHeader: false,
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
      NO: {
        title: "NO",
        type: "Number",
        filter: false,
        editable: false,
        width: "10%",
        sortDirection: "asc"
      },
      USER_ID: {
        title: "User ID",
        type: "string",
        filter: true,
        editable: false,
        width: "30%"
      },
      USERNAME: {
        title: "Username",
        type: "string",
        filter: true,
        editable: false,
        width: "30%"
      },
      DATETIME_LOGIN: {
        title: "Datetime Login",
        type: "string",
        filter: true,
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

  async loadData() {
    let LogData: any = [];
    let userData: any = [];
    await this.service
      .getreq("LOGIN_LOGs")
      .toPromise()
      .then(response => {
        if (response != null) {
          let arr = response.filter(item => {
            return item.COMPONENT == "MONI";
          });
          console.log(response);
          if (arr != null) {
            LogData = arr;
          }
        }
      });

    await this.service
      .getreq("mst_users")
      .toPromise()
      .then(res => {
        if (res != null) {
          userData = res;
        }
      });

    await LogData.forEach((element, index) => {
      var lengthLog = parseInt(LogData.length);
      let detail = {
        NO: lengthLog - index,
        DATETIME_LOGIN: "",
        USERNAME: "",
        USER_ID: ""
      };
      detail.USERNAME = element.USERNAME;
      detail.USER_ID = element.USER_ID;
      detail.DATETIME_LOGIN = moment(element.DATETIME_LOGIN).format(
        "DD/MM/YYYY HH:mm:ss"
      );

      this.tabledata.push(detail);
    });
    this.source.load(this.tabledata);
  }
}
