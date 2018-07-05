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
      USERNAME: {
        title: "Username",
        type: "string",
        filter: true,
        editable: false,
        width: "30%"
      },
      NAMA: {
        title: "Nama",
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
        width: "30%",
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
    await this.service.getreq("LOGIN_LOGs").toPromise().then(response => {
      if (response != null) {
        LogData = response;
      }
    });

    await this.service.getreq("mst_users").toPromise().then(res => {
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
        NAMA: ""
      }
      detail.USERNAME = element.USERNAME;
      detail.DATETIME_LOGIN = moment(element.DATETIME_LOGIN).format("DD/MM/YYYY HH:mm:ss");
      let arr = userData.filter(item => {
        return (
          item.ID_USER == detail.USERNAME
        );
      });
      if (arr[0] != null) {
        detail.NAMA = arr[0].USER_NAME
      };
      this.tabledata.push(detail);   
    });
    this.source.load(this.tabledata);
  }


}
