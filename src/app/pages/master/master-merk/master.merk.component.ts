import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";
@Component({
  selector: "ngx-master-merk",
  templateUrl: "./master.merk.component.html"
})
export class MasterMerkComponent {
  @ViewChild("myForm")
  private myForm: NgForm;

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
      KD_MERK: {
        title: "Kode Merk",
        type: "string",
        filter: true,
        editable: false,
        width: "40%"
      },
      NM_MERK: {
        title: "Nama Merk",
        type: "string",
        filter: true,
        editable: true,
        width: "40%"
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
  loadData() {
    this.service.getreq("m_merks").subscribe(response => {
      if (response != null) {
        this.tabledata = response;
        console.log(JSON.stringify(response));
        this.source.load(this.tabledata);
      }
    });
  }

  submit(event) {
    this.tabledata.forEach((element, ind) => {
      if (element.KD_MERK == event.newData.KD_MERK) {
        element.NM_MERK = event.newData.NM_MERK;
        element.FLAG_ACTIVE = event.newData.FLAG_ACTIVE;
        this.service.patchreq("m_merks", event.newData).subscribe(response => {
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
      KD_MERK: event.newData.KD_MERK,
      NM_MERK: event.newData.NM_MERK,
      FLAG_ACTIVE: event.newData.FLAG_ACTIVE,
      USER_UPDATE: "Admin",
      DATETIME_UPDATE: moment().format()
    };

    this.service.postreq("m_merks", data).subscribe(response => {
      console.log(response);
      event.confirm.resolve(event.newData);
      this.toastr.success("Data Saved!");
    });
  }
}
