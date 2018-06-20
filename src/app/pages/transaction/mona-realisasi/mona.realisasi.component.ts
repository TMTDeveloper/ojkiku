import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";
import { MonaRealisasiDatePicker } from "./button.mona.realisasi.component";

@Component({
  selector: "ngx-mona-realisasi",
  templateUrl: "./mona.realisasi.component.html",
  styles: [`
  input:disabled {
    background-color: rgba(211,211,211, 0.6);
 }`]
})

export class MonaRealisasiComponent {
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
      confirmSave: false
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
        title: "NO",
        type: "number",
        filter: false,
        editable: false,
        width: "5%"
      },
      TIPE_DOKUMEN: {
        title: "Tipe Dokumen",
        type: "string",
        filter: false,
        editable: false,
        width: "10%"
      },
      ID_BANK: {
        title: "Bank",
        type: "string",
        filter: false,
        editable: false,
        width: "20%"
      },
      START_DATE: {
        title: "Start Date",
        type: "date",
        filter: false,
        editable: true,
        width: "10%"
      },
      TARGET_DATE: {
        title: "Target Date",
        type: "date",
        filter: false,
        editable: false,
        width: "10%",
      },
      REALIZATION_DATE: {
        title: "Realization Date",
        type: "string",
        filter: false,
        editable: true,
        width: "10%",
        //renderComponent: MonaRealisasiDatePicker
      },
      KETERANGAN: {
        title: "Keterangan",
        type: "string",
        filter: false,
        editable: true,
        width: "25%",
      },
      USER_REALIZATION: {
        title: "Updated By",
        type: "string",
        filter: false,
        editable: true,
        width: "10%",
      },
    }
  };

  formData = {
    documentData: [
      {
        id: "rbp",
        desc: "RBP"
      },
      {
        id: "lainlain",
        desc: "Lain-lain"
      }
    ],
    documentSelected: "",
    bankSelected: "",
    years: moment().format("YYYY"),
    threshold: 0,
    bankData: [],
    monaRealisasiData: []
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
        this.formData.bankData = response;
      }
    });
  }


  getFuckingData() {
    this.service.getreq("trn_monas").subscribe(res => {
      if (res != null) {
        let arrs = res.filter(items => {
          return (
            items.ID_BANK == this.formData.bankSelected &&
            items.TIPE_DOKUMEN == this.formData.documentSelected &&
            items.YEAR == this.formData.years
          );
        });
        let monaTargetdetail = [];
        arrs.forEach((element, index) => {
          if (res != null) {
            let detail = {
              NO: 1,
              KODE_BANK: 0,
              TIPE_DOKUMEN: "kosong",
              ID_BANK: "kosong",
              START_DATE: "kosong",
              TARGET_DATE: "kosong",
              REALIZATION_DATE: "kosong",
              USER_REALIZATION: "Kosong",
              KETERANGAN: "Belum di isi",
              YEAR: 0
            };

            detail.NO = index+1;
            detail.KODE_BANK = element.ID_BANK;
            detail.TIPE_DOKUMEN = element.TIPE_DOKUMEN;
            detail.YEAR = element.YEAR;
            detail.START_DATE = moment(element.START_DATE).format("DD/MM/YYYY");
            detail.TARGET_DATE = moment(element.TARGET_DATE).format("DD/MM/YYYY");

            let arrBank = this.formData.bankData.filter(item => {
              return (
                item.ID_BANK == element.ID_BANK
              );
            });
            if (arrBank[0] != null) {
              detail.ID_BANK = arrBank[0].DESCRIPTION
            }
            this.service.getreq("trn_mona_realizations").subscribe(res => {
              if (res != null) {
                let arrs = res.filter(items => {
                  return (
                    items.ID_BANK == detail.KODE_BANK &&
                    items.TIPE_DOKUMEN == detail.TIPE_DOKUMEN &&
                    items.YEAR == detail.YEAR
                  );
                });
                if (arrs[0] != null) {
                  detail.REALIZATION_DATE = moment(arrs[0].REALIZATION_DATE).format("DD/MM/YYYY");
                  detail.KETERANGAN = arrs[0].KETERANGAN;
                  detail.USER_REALIZATION = arrs[0].USER_REALIZATION;
                  console.log(detail)

                  monaTargetdetail.push(detail);
                  
                  this.formData.monaRealisasiData = monaTargetdetail;
                  this.tabledata = monaTargetdetail;
                  this.source.load(this.tabledata);
                  this.source.refresh();
                }
              }
            });
            
          }
        });
        this.toastr.success("Get Data Success!")
      } else {
        this.toastr.error("Data Not Found!")
        this.tabledata = []
        this.source.load(this.tabledata);
        this.source.refresh();
      }
    });
    this.source.refresh();
  }


  updateData() {
    this.tabledata.forEach((element) => {
      let header = {
        ID_BANK: element.KODE_BANK,
        YEAR: element.YEAR,
        TIPE_DOKUMEN: element.TIPE_DOKUMEN,
        KETERANGAN: element.KETERANGAN,
        USER_REALIZATION: "admin",
        REALIZATION_DATE: moment(this.dateReformat(element.REALIZATION_DATE)).format(),
        USER_UPDATED: "admin",
        DATE_UPDATED: moment().format()
      }
      console.log(element.REALIZATION_DATE)
      console.log(header.REALIZATION_DATE)
      this.service.postreq("trn_mona_realizations/crud", header).subscribe(
        response => {
          console.log(response);
        },
        error => {
          //console.log("indicator detail");
          console.log(error);
        }
      )
    })
    this.toastr.success("Data Saved!");
  }

  editConfirm(event) {

    console.log(event.newData);
    event.confirm.resolve(event.newData);
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

  dateReformat(value){
    let str = value.split("/");
    return str[2] + "-" + str[1] + "-" + str[0]
  }

}

