import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";
@Component({
  selector: "ngx-master-bank",
  templateUrl: "./master.bank.component.html"
})
export class MasterBankComponent {
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
      ID_BANK: {
        title: "Id Bank",
        type: "string",
        filter: false,
        editable: false,
        width: "30%"
      },
      INISIAL: {
        title: "Inisial ",
        type: "number",
        filter: false,
        editable: true,
        width: "30%"
      },
      DESCRIPTION: {
        title: "Description",
        type: "number",
        filter: false,
        editable: true,
        width: "30%"
      },
      FLAG_ACTIVE: {
        title: "Flag Active",
        type: "html",
        width: "10%",
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
  loadData() {
    this.service.getreq("mst_banks").subscribe(response => {
      if (response != null) {
        this.tabledata = response;
        console.log(JSON.stringify(response));
        this.source.load(this.tabledata);
      }
    });
  }

  submit(event) {
    this.tabledata.forEach((element, ind) => {
      if (element.ID_BANK == event.newData.ID_BANK) {
        element.INISIAL = event.newData.ID_BANK;
        element.DESCRIPTION = event.newData.DESCRIPTION;
        element.FLAG_ACTIVE = event.newData.FLAG_ACTIVE;
        this.service
          .patchreq("mst_banks", event.newData)
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
      ID_BANK: event.newData.ID_BANK,
      INISIAL: event.newData.INISIAL,
      DESCRIPTION: event.newData.DESCRIPTION,
      FLAG_ACTIVE: event.newData.FLAG_ACTIVE,
      USER_CREATED: "Admin",
      DATETIME_CREATED: moment().format(),
      USER_UPDATED: "Admin",
      DATETIME_UPDATED: moment().format()
    };

    this.tabledata.push(data);
    this.service.postreq("mst_banks", data).subscribe(response => {
      console.log(response);
      event.confirm.resolve(event.newData);
      this.toastr.success("Data Saved!");
    });
  }
}
