import { LocalDataSource } from "ng2-smart-table";
import { Component, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal, NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { BackendService } from "../../../../@core/data/backend.service";


@Component({
  selector: "ngx-realisasi-qualitative-modal",
  templateUrl: "./realisasi.qualitative.modal.component.html",
  styles: [`
  input:disabled {
    background-color: rgba(211,211,211, 0.6);
 }`]
})





export class RealisasiQualitativeModalComponent {

  source: LocalDataSource = new LocalDataSource();

  tabledata: any[] = [];

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
      NO_DETAIL: {
        title: "No",
        type: "number",
        filter: true,
        editable: false,
        width: "5%",
        sortDirection: 'asc'

      },
      TIPE_DATA: {
        title: "Tipe Data",
        type: "string",
        editable: false,
        filter: false,
        width: "10%",

      },
      JUDUL: {
        title: "Judul",
        type: "string",
        filter: false,
        editable: false,
        width: "45%"
      },
      DESKRIPSI: {
        title: "Deskripsi",
        type: "string",
        filter: false,
        editable: true,
        width: "45%"

      }
    }
  };

  formData = {

    ikuSelected: String,
    tahunSelected: String,
    periodeSelected: String,
    bankSelected: String,
    noUrut: Number

  };

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    public service: BackendService
  ) { }

  ngOnInit() {
    //this.source.load(this.tabledata)
    //console.log(this.formData)
    this.generateDetail();
  }

  generateDetail() {
    this.service.getreq("trn_indicator_qls").subscribe(response => {
      if (response != null) {
        let arr = response.filter(item => {
          return (
            item.KODE_IKU == this.formData.ikuSelected &&
            item.TAHUN_INDICATOR == this.formData.tahunSelected &&
            item.PERIODE == this.formData.periodeSelected
          );
        });
        if (arr[0] != null) {
          let realisasidetail = [];
          arr.forEach((element, index) => {
            let detail = {
              KODE_IKU: this.formData.ikuSelected,
              TAHUN_REALISASI: this.formData.tahunSelected,
              PERIODE: this.formData.periodeSelected,
              KODE_BANK: this.formData.bankSelected,
              NO_URUT: this.formData.noUrut,
              NO_DETAIL: Number,
              TIPE_DATA: String,
              JUDUL: String,
              DESKRIPSI: "Belum Di isi",
              USER_CREATED: "admin",
              DATETIME_CREATED: moment().format(),
              USER_UPDATED: "admin",
              DATETIME_UPDATED: moment().format(),
            };

            detail.NO_DETAIL = element.NO_DETAIL;
            detail.TIPE_DATA = element.TIPE_DATA;
            detail.JUDUL = element.DESKRIPSI;

            this.service.getreq("trn_realization_ql_dtls").subscribe(res => {
              if (res != null) {
                let arrDtl = res.filter(item => {
                  return (
                    item.KODE_IKU == this.formData.ikuSelected &&
                    item.TAHUN_REALISASI == this.formData.tahunSelected &&
                    item.PERIODE == this.formData.periodeSelected &&
                    item.KODE_BANK == this.formData.bankSelected &&
                    item.NO_URUT == this.formData.noUrut &&
                    item.NO_DETAIL == element.NO_DETAIL
                  );
                });
                console.log(arrDtl)
                if (arrDtl[0] != null) {
                  detail.DESKRIPSI = arrDtl[0].DESKRIPSI
                  realisasidetail.push(detail);
                  this.tabledata = realisasidetail;
                  this.source.load(this.tabledata)
                  this.source.refresh();
                } else {
                  detail.DESKRIPSI = "Belum di isi"
                  realisasidetail.push(detail);
                  this.tabledata = realisasidetail;
                  this.source.load(this.tabledata)
                  this.source.refresh();
                }
              }
            })
          })
        }
      }
    })
  }

  save() {
    console.log(this.tabledata)
    this.tabledata.forEach(element => {
      let header = {
        KODE_IKU: this.formData.ikuSelected,
        TAHUN_REALISASI: this.formData.tahunSelected,
        PERIODE: this.formData.periodeSelected,
        KODE_BANK: this.formData.bankSelected,
        NO_URUT: this.formData.noUrut,
        NO_DETAIL: element.NO_DETAIL,
        TIPE_DATA: element.TIPE_DATA,
        JUDUL: element.JUDUL,
        DESKRIPSI: element.DESKRIPSI,
        USER_CREATED: "admin",
        DATETIME_CREATED: moment().format(),
        USER_UPDATED: "admin",
        DATETIME_UPDATED: moment().format(),
      }
      console.log(header)
      this.service.postreq("trn_realization_ql_dtls/crud", header).subscribe(response => {
        if (response != null) {
          this.toastr.success("Data Updated!");
          this.closeModal();
        } else {
          this.toastr.error("Update Failed!")
        }
      });
    });
  }

  editConfirm(event) {
    //console.log(event.newData.RESULT1);
    event.confirm.resolve(event.newData);
  }

  closeModal() {
    this.activeModal.close();
  }
}
