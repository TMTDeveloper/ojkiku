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
      TIPE_DATA: {
        title: "Tipe Data",
        type: "string",
        editable: false,
        filter: false,
        width: "10%",
        
      },
      JUDUL: {
        title: "Judul",
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
      DESKRIPSI: {
        title: "Deskripsi",
        type: "string",
        filter: false,
        editable: true,
        width: "70%"

      }
    }
  };

  tabledata = [
    {NO: 1,TIPE_DATA: "String",JUDUL: "Dummy 1",DESKRIPSI: "Dummy 1"},
    {NO: 2,TIPE_DATA: "Date",JUDUL: "Dummy 2",DESKRIPSI: "Dummy 2"},
    {NO: 3,TIPE_DATA: "Number",JUDUL: "Dummy 3",DESKRIPSI: "Dummy 3"},
    {NO: 4,TIPE_DATA: "String",JUDUL: "Dummy 4",DESKRIPSI: "Dummy 4"},
    {NO: 5,TIPE_DATA: "Date",JUDUL: "Dummy 5",DESKRIPSI: "Dummy 5"},
]

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
    startDate: "",
    targetDate: "",
    keterangan: "",
    year: moment().format("YYYY"),
    bankData: [],
  };

  constructor(
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
    public service: BackendService
  ) { }

  ngOnInit() {
    this.source.load(this.tabledata)
  }

  dateReformat(value) {
    return value.year + "-" + value.month + "-" + value.day
  }

  addNewData() {
    
    let header = {
      YEAR: this.formData.year,
      ID_BANK: this.formData.bankSelected,
      TIPE_DOKUMEN: this.formData.documentSelected,
      KETERANGAN: this.formData.keterangan,
      START_DATE: moment(this.dateReformat(this.formData.startDate)).format(),
      TARGET_DATE: moment(this.dateReformat(this.formData.targetDate)).format(),
      USER_CREATED: "admin",
      DATE_CREATED: moment().format(),
      USER_UPDATED: "admin",
      DATE_UPDATED: moment().format(),
    }
    console.log(header)
    this.service.postreq("trn_monas", header).subscribe(response => {
      if (response != null) {
        this.toastr.success("Data Added!")
        let data = {
          yearPeriode: this.formData.startDate
        }
        this.activeModal.close(data);
      } else {
        this.toastr.error("Add Data Failed!")
      }
    });
  }

  refreshSelected(event) {
    // this.selectedData = event.data;
  }

  submit() { }

  closeModal() {
    this.activeModal.close();
  }
}
