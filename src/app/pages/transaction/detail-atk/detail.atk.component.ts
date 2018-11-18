import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";
import { DetailAtkModalComponent } from "./modal/detail.atk.modal.component";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";

@Component({
  selector: "ngx-detail-atk",
  templateUrl: "./detail.atk.component.html"
})
export class DetailAtkComponent {
  @ViewChild("myForm")
  private myForm: NgForm;

  source: LocalDataSource = new LocalDataSource();
  user: any;

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
    mode: "external",
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
      NO_SR: {
        title: "No",
        type: "number",
        filter: false,
        editable: false,
        width: "10%"
      },
      NM_BARANG: {
        title: "Nama Barang",
        type: "string",
        filter: true,
        editable: false,
        width: "30%"
      },
      NM_MERK: {
        title: "Nama Merk",
        type: "string",
        filter: true,
        editable: false,
        width: "30%"
      },
      QTY: {
        title: "Qty Order",
        type: "string",
        filter: false,
        editable: true,
        width: "15%"
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
  barang: any[] = [];
  barangFiltered: any[] = [];
  merk: any[] = [];
  order: any[] = [];
  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    public service: BackendService,
    private authService: NbAuthService
  ) {
    this.loadData();
    this.getUserInfo();
    this.getBarang();
    this.getMerk();
    this.getOrder();
  }

  getOrder() {
    this.service
      .getreq("t_order_hds")
      .toPromise()
      .then(response => {
        if (response != null) {
          this.order = response;
        }
      });
  }

  getBarang() {
    this.service
      .getreq("m_barangs")
      .toPromise()
      .then(response => {
        if (response != null) {
          response.push({
            KD_BARANG: "",
            NM_BARANG: ""
          });
          this.barang = response;
          this.barangFiltered = response;
        }
      });
  }

  getMerk() {
    this.service
      .getreq("m_merks")
      .toPromise()
      .then(response => {
        if (response != null) {
          this.merk = response;
        }
      });
  }

  getUserInfo() {
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.user = token.getPayload(); // here we receive a payload from the token and assigne it to our `user` variable
      }
    });
  }

  create(event) {
    this.activeModal = this.modalService.open(DetailAtkModalComponent, {
      windowClass: "xlModal",
      container: "nb-layout",
      backdrop: "static"
    });
    console.log(event.data);
    console.log(this.user.USER_NAME);
    if (event.data != null) {
      this.activeModal.componentInstance.formData.barang = event.data.KD_BARANG;
      this.activeModal.componentInstance.formData.merk = event.data.KD_MERK;
      this.activeModal.componentInstance.formData.NO_SR = event.data.NO_SR;
      this.activeModal.componentInstance.formData.NM_BARANG =
        event.data.NM_BARANG;
      this.activeModal.componentInstance.formData.NM_MERK = event.data.NM_MERK;
    }
    this.activeModal.componentInstance.formData.USER_TRANSACTION = this.user.ID_USER;
    this.activeModal.componentInstance.merk = this.merk;
    this.activeModal.componentInstance.barang = this.barang;
    this.activeModal.componentInstance.barangFiltered = this.barang;

    this.activeModal.result.then(
      async response => {
        //console.log(response);
        let arr = this.barang.filter(item => {
          return item.KD_BARANG == response.KD_BARANG;
        });
        if (arr[0] != null) {
          response.NM_BARANG = arr[0].NM_BARANG;
        }
        let array = this.merk.filter(item => {
          return item.KD_MERK == response.KD_MERK;
        });
        if (array[0] != null) {
          response.NM_MERK = array[0].NM_MERK;
        }
        if (response != null && event.data != null) {
          this.tabledata[event.data.NO_SR - 1] = response;
          console.log(this.tabledata);
          this.source.load(this.tabledata);
        } else {
          let counter = this.tabledata.length + 1;
          response.NO_SR = counter;
          this.tabledata.push(response);
          console.log(this.tabledata);
          this.source.load(this.tabledata);
        }
      },
      error => {}
    );
  }

  async loadData() {
    let respIku: any[];
    await this.service
      .getreq("mst_ikus")
      .toPromise()
      .then(response => {
        if (response != null) {
          respIku = response;
        }
      });
    let arr = await respIku.filter(item => {
      return item.TIPE_IKU == "QUALITATIVE";
    });

    if (arr[0] != null) {
      this.formData.ikuData = arr;
    } else {
      this.toastr.error("Tidak Ditemukan IKU Qualitative Data");
    }
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

  updateData() {
    let kd_order = this.generateCode();
    this.tabledata.forEach(element => {
      element.KD_ORDER = kd_order;
    });
    let data = {
      KD_ORDER: kd_order,
      TEAM_ID: this.user.TEAM,
      USER_ID: this.user.ID_USER,
      DEPARTMENT: "",
      DATE_ORDER: moment().format(),
      STATUS_ORDER: "CONFIRMED",
      USER_TRANSACTION: this.user.ID_USER,
      DATE_TIME_TRANSACTION: moment().format()
    };
    console.log(data);
    this.service.postreq("t_order_hds", data).subscribe(
      response => {
        console.log(response);
        this.toastr.success("Data Saved!");
        this.tabledata.forEach(element => {
          this.service.postreq("t_order_dts", element).subscribe(
            response => {
              console.log(response);
            },
            error => {
              //console.log("indicator detail");
              console.log(error);
            }
          );
        });
      },
      error => {
        //console.log("indicator detail");
        console.log(error);
        this.toastr.error("Data Error!");
      }
    );
  }

  generateCode() {
    let counter = this.order.length + 1;
    if (counter < 10) {
      return "OR00" + counter.toString();
    } else if (counter < 100) {
      return "OR0" + counter.toString();
    } else if (counter < 1000) {
      return "OR" + counter.toString();
    }
  }
}
