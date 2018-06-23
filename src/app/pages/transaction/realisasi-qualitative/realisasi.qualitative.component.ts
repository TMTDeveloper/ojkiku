import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";
import { ButtonRenderComponent } from "./button.realisasi.quantitative.component"
import { renderComponent } from "@angular/core/src/render3";

@Component({
  selector: "ngx-realisasi-qualitative",
  templateUrl: "./realisasi.qualitative.component.html"
})
export class RealisasiQualitativeComponent {
  @ViewChild("myForm") private myForm: NgForm;

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
        title: "No",
        type: "number",
        filter: false,
        editable: false,
        width: "5%"
      },
      DETAIL: {
        title: "Detail",
        type: "custom",
        editable: false,
        filter: false,
        width: "10%",
        renderComponent: ButtonRenderComponent
      },
      STATUS: {
        title: "Status",
        type: "html",
        editor: {
          type: "list",
          config: {
            list: [{ title: 'Selesai', value: 'selesai' }, { title: 'Belum Selesai', value: 'belum selesai' }, { title: 'Pantau', value: 'pantau' }]
          }
        },
        filter: false,
        editable: true,
        width: "15%"
      },
      KETERANGAN: {
        title: "Keterangan",
        type: "string",
        filter: false,
        editable: true,
        width: "70%"

      }
    }
  };

  formData = {
    periode: [
      {
        id: "TW1",
        desc: "Triwulan 1"
      },
      {
        id: "TW2",
        desc: "Triwulan 2"
      },
      {
        id: "TW3",
        desc: "Triwulan 3"
      },
      {
        id: "TW4",
        desc: "Triwulan 4"
      }
    ],
    ikuSelected: "",
    yearPeriode: moment().format("YYYY"),
    periodeSelected: "",
    bankSelected: "",
    ikuData: [],
    bankData: [],
    realisasiDetail: [],
  };



  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    public service: BackendService
  ) {
    this.loadData();
  }
  loadData() {
    this.service.getreq("mst_ikus").subscribe(response => {
      if (response != null) {
        this.formData.ikuData = response;
        this.service.getreq("mst_banks").subscribe(response => {
          if (response != null) {
            this.formData.bankData = response;
          }
        });
      }
    });
  }

  updateData() {
    this.tabledata.forEach((element) => {
      this.service.postreq("trn_realization_qls/crud", element).subscribe(
        response => {
          console.log(response);
        },
        error => {
          //console.log("indicator detail");
          console.log(error);
        }
      )
    })
    this.toastr.success("Data Updated!");
  }

  submit(event) {
    this.tabledata.forEach((element, ind) => {
      if (element.KODE_IKU == event.newData.KODE_IKU) {
        element.KODE_IKU = event.newData.KODE_IKU;
        element.DESKRIPSI = event.newData.DESKRIPSI;
        element.TIPE_IKU = event.newData.TIPE_IKU;
        this.service
          .patchreq("mst_ikus", this.tabledata[ind])
          .subscribe(response => {
            console.log(JSON.stringify(response));
            event.confirm.resolve(event.newData);
            this.toastr.success("Data Updated!");
          });
      }
    });
  }

  addData() {
    let header = {
      KODE_IKU: this.formData.ikuSelected,
      TAHUN_REALISASI: this.formData.yearPeriode,
      PERIODE: this.formData.periodeSelected,
      KODE_BANK: this.formData.bankSelected,
      NO_URUT: 5,
      STATUS: "test",
      KETERANGAN: "test",
      USER_CREATED: "admin",
      DATETIME_CREATED: moment().format(),
      USER_UPDATED: "admin",
      DATETIME_UPDATED: moment().format()
    };
    console.log(header)
    this.service.postreq("trn_realization_qls", header).subscribe(response => {
      console.log(header)
      if (response != null) {
        console.log(header)
        console.log(response);
      }
    });
  }

  generateDetail() {
    this.service.getreq("trn_realization_qls").subscribe(response => {
      if (response != null) {
        let arr = response.filter(item => {
          return (
            item.KODE_IKU == this.formData.ikuSelected &&
            item.TAHUN_REALISASI == this.formData.yearPeriode &&
            item.PERIODE == this.formData.periodeSelected &&
            item.KODE_BANK == this.formData.bankSelected
          );
        });
        let realisasiDetail = [];
        arr.forEach((element, ind) => {
          let detail = {
            KODE_IKU: this.formData.ikuSelected,
            TAHUN_REALISASI: this.formData.yearPeriode,
            PERIODE: this.formData.periodeSelected,
            KODE_BANK: element.KODE_BANK,
            NO: ind+1,
            STATUS: element.STATUS,
            KETERANGAN: element.KETERANGAN,
            USER_CREATED: "Admin",
            DATETIME_CREATED: moment().format(),
            USER_UPDATED: "Admin",
            DATETIME_UPDATED: moment().format(),
            DESC_BANK: this.formData.bankData.filter(item => {
              return item.ID_BANK == element.KODE_BANK;
            })[0].DESCRIPTION
          };
          realisasiDetail.push(detail);
        });
        this.tabledata = realisasiDetail;
        this.formData.realisasiDetail = realisasiDetail;
        this.source.load(this.tabledata);
      } else {
        this.toastr.error("Data Not Found!");
        this.tabledata = [];
        this.source.load(this.tabledata);
      }
    });
}

save() {
  let header = {
    KODE_IKU: this.formData.ikuSelected,
    TAHUN_REALISASI: this.formData.yearPeriode,
    PERIODE: this.formData.periodeSelected,
    KODE_BANK: this.formData.bankSelected,
    NO: 0,
    STATUS: "belum tuntas",
    KETERANGAN: "belum di isi",
    USER_CREATED: "Admin",
    DATETIME_CREATED: moment().format(),
    USER_UPDATED: "Admin",
    DATETIME_UPDATED: moment().format(),
  };
  this.service.postreq("trn_realization_qls", header).subscribe(response => {
      console.log(response);
      
      this.toastr.success("Data Saved!");
    },
    error => {
      console.log("indicator header");
      console.log(error);
    }
  );
}

editConfirm(event) {
  event.newData.RESULT1 =
    (
      event.newData.NILAI_REALISASI_1 /
      event.newData.NILAI_INDICATOR_1 *
      100
    ).toFixed(2) + "%";
  event.newData.RESULT2 =
    (
      event.newData.NILAI_REALISASI_2 /
      event.newData.NILAI_INDICATOR_2 *
      100
    ).toFixed(2) + "%";
  event.newData.RESULT3 =
    (
      event.newData.NILAI_REALISASI_3 /
      event.newData.NILAI_INDICATOR_3 *
      100
    ).toFixed(2) + "%";
  console.log(event.newData.RESULT1);
  event.confirm.resolve(event.newData);
}
}
