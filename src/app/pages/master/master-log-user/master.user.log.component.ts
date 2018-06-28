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
        filter: false,
        editable: false,
        width: "30%"
      },
      NAMA: {
        title: "Nama",
        type: "string",
        filter: false,
        editable: false,
        width: "30%"
      },
      DATETIME_LOGIN: {
        title: "Datetime Login",
        type: "string",
        filter: false,
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

  loadData() {
    this.service.getreq("LOGIN_LOGs").subscribe(response => {
      if (response != null) {
        let logDetail = [];
        var lengthLog = parseInt(response.length);
        console.log(lengthLog)
        response.forEach((element,index) => {
          let detail = {
            NO: lengthLog-index,
            DATETIME_LOGIN: "",
            USERNAME: "",
            NAMA: ""
          }
          detail.USERNAME = element.USERNAME;
          detail.DATETIME_LOGIN = moment(element.DATETIME_LOGIN).format("DD/MM/YYYY HH:mm:ss");
          this.service.getreq("mst_users").subscribe(res => {

            if (res != null) {
              let arr = res.filter(item => {
                return (
                  item.ID_USER == detail.USERNAME
                );
              });
              if (arr[0] != null) {
                detail.NAMA = arr[0].USER_NAME
              }
              logDetail.push(detail);
              this.tabledata = logDetail;
              this.source.load(this.tabledata);
              
            }
          })
        });
        console.log(logDetail)
      }
    });
  }

}
