import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";
import { ButtonRenderComponent } from "./button.realisasi.quantitative.component";

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
        valuePrepareFunction: (cell, row) => row,
        renderComponent: ButtonRenderComponent
      },
      STATUS: {
        title: "Status",
        type: "html",
        editor: {
          type: "list",
          config: {
            list: [
              { title: 'Selesai', value: 'Selesai' },
              { title: 'Belum Selesai', value: 'Belum Selesai' },
              { title: 'Pantau', value: 'Pantau' }]
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

  async loadData() {
    let respIku : any [];
    await this.service.getreq("mst_ikus").toPromise().then(response => {
      if (response != null) {
        respIku = response;
      }
    });
    let arr = await respIku.filter(item => {
      return (
        item.TIPE_IKU == "QUALITATIVE"
      )
    });

    if (arr[0] != null) {
      this.formData.ikuData = arr;
    } else {
      this.toastr.error("Tidak Ditemukan IKU Qualitative Data")
    }

    await this.service.getreq("mst_banks").toPromise().then(response => {
      if (response != null) {
        this.formData.bankData = response;
      }
    });
  }

  updateData() {
    this.tabledata.forEach((element) => {
      if (element.STATUS == "Selesai") {
        element.STATUS = "selesai";
      }
      if (element.STATUS == "Belum Selesai") {
        element.STATUS = "blmselesai";
      }
      if (element.STATUS == "Pantau") {
        element.STATUS = "pantau";
      }
      let header = {
        KODE_IKU: element.KODE_IKU,
        TAHUN_REALISASI: element.TAHUN_REALISASI,
        PERIODE: element.PERIODE,
        KODE_BANK: element.KODE_BANK,
        NO_URUT: element.NO,
        STATUS: element.STATUS,
        KETERANGAN: element.KETERANGAN,
        USER_CREATED: "admin",
        DATETIME_CREATED: moment().format(),
        USER_UPDATED: "admin",
        DATETIME_UPDATED: moment().format()
      }
      //console.log(header);
      this.service.postreq("trn_realization_qls/crud", header).subscribe(
        response => {
          //console.log(response);
        },
        error => {
          //console.log("indicator detail");
          //console.log(error);
        }
      )
    })
    this.toastr.success("Data Updated!");
  }



  addData() {
    let header = {
      KODE_IKU: this.formData.ikuSelected,
      TAHUN_REALISASI: this.formData.yearPeriode,
      PERIODE: this.formData.periodeSelected,
      KODE_BANK: this.formData.bankSelected,
      NO_URUT: 1,
      STATUS: "blmselesai",
      KETERANGAN: "Belum Di Isi",
      USER_CREATED: "admin",
      DATETIME_CREATED: moment().format(),
      USER_UPDATED: "admin",
      DATETIME_UPDATED: moment().format()
    };
    this.service.getreq("trn_realization_qls").subscribe(res => {
      if (res != null) {
        header.NO_URUT = res.length + 1
      }
    })
    console.log(header)
    this.service.postreq("trn_realization_qls", header).subscribe(response => {
      //console.log(header)
      if (response != null) {
        this.toastr.success("Data Added!")
      } else {
        this.toastr.error("Failed Add Data!")
      }
    });
    this.generateDetail()
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
        if (arr[0] != null) {
          let realisasiDetail = [];
          arr.forEach((element, ind) => {
            if (element.STATUS == "selesai") {
              element.STATUS = "Selesai";
            }
            if (element.STATUS == "blmselesai") {
              element.STATUS = "Belum Selesai";
            }
            if (element.STATUS == "pantau") {
              element.STATUS = "Pantau";
            }
  
            let detail = {
              KODE_IKU: this.formData.ikuSelected,
              TAHUN_REALISASI: this.formData.yearPeriode,
              PERIODE: this.formData.periodeSelected,
              KODE_BANK: element.KODE_BANK,
              NO: ind + 1,
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
          this.toastr.success("Get Data Success!")
        } else {
          this.toastr.error("Data Not Found!");
          this.tabledata = [];
          this.source.load(this.tabledata);
        }
      }
    })
  }

  editConfirm(event) {
    //console.log(event.newData.RESULT1);
    event.confirm.resolve(event.newData);
  }
}
