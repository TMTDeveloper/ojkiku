import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";
import { IndicatorQualitativeModalComponent } from "./modal/indicator.qualitative.modal.component";

@Component({
  selector: "ngx-indicator-qualitative",
  templateUrl: "./indicator.qualitative.component.html"
})
export class IndicatorQualitativeComponent {
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
      NO_DETAIL: {
        title: "No",
        type: "number",
        filter: true,
        editable: true,
        width: "10%"
      },
      TIPE_DATA: {
        title: "Type Data",
        type: "html",
        editor: {
          type: "list",
          config: {
            list: [{title: 'String', value: 'string'}, {title: 'Date', value: 'date'},{title: 'Number', value: 'number'}]
          }
        },
        filter: false,
        editable: true,
        width: "10%"
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
    periodeSelected: "",
    ikuData: [],
    ikuSelected: "",
    indicatorQualitativeData: [],
    yearPeriode: moment().format("YYYY")
    
  };

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    public service: BackendService
  ) {
    this.loadData();
  }

  showModal() {
    this.activeModal = this.modalService.open(
      IndicatorQualitativeModalComponent,
      {
        windowClass: "xlModal",
        container: "nb-layout",
        backdrop: "static"
      }
    );
    
    this.activeModal.componentInstance.formData.ikuData = this.formData.ikuData;
    this.activeModal.componentInstance.formData.ikuSelected = this.formData.ikuSelected;
    this.activeModal.componentInstance.formData.yearPeriode = this.formData.yearPeriode;
    this.activeModal.componentInstance.formData.periodeSelected = this.formData.periodeSelected;
    this.activeModal.result.then(
      async response => {
        //console.log(response);
        if (response != null) {
          this.formData.ikuSelected = response.ikuSelected
          this.formData.periodeSelected = response.periodeSelected
          this.formData.yearPeriode = response.yearPeriode
          this.tabledata = response.indicatorQualitativeData;
          this.formData.indicatorQualitativeData = response.indicatorQualitativeData;
          this.source.load(this.tabledata);
          
        }
      },
      error => { }
    );
  }

  loadData() {
    this.service.getreq("mst_ikus").subscribe(response => {
      if (response != null) {
        this.formData.ikuData = response;
      }
    });
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

  generateDetail() {
    this.service.getreq("trn_indicator_qls").subscribe(response => {
      if (response != null) {
        let arr = response.filter(item => {
          return (
            item.KODE_IKU == this.formData.ikuSelected &&
            item.TAHUN_INDICATOR == this.formData.yearPeriode &&
            item.PERIODE == this.formData.periodeSelected
          )
        })
        if (arr[0] != null) {
         arr.forEach((element, ind) => {
          element.NO_DETAIL = ind + 1
          this.formData.indicatorQualitativeData.push(element)
          })
          this.toastr.success("Load Data Success!");
          this.source.load(this.formData.indicatorQualitativeData);
          console.log(this.tabledata)
        } else {
          this.toastr.error("Data Not Found!");
          this.tabledata = [];
          this.source.load(this.tabledata);
        }
      }
    });
  }

  updateData() {
    this.formData.indicatorQualitativeData.forEach((element) => {
      this.service.postreq("trn_indicator_qls/crud", element).subscribe(
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
}

