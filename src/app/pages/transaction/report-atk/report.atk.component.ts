import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";
import { ReportAtkModalComponent } from "./modal/report.atk.modal.component";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";
import { IMyDpOptions, IMyInputFieldChanged } from "mydatepicker";
import * as jsPDF from "jspdf";
import * as html2canvas from "html2canvas";
@Component({
  selector: "ngx-report-atk",
  templateUrl: "./report.atk.component.html"
})
export class ReportAtkComponent {
  @ViewChild("myForm")
  private myForm: NgForm;
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: "dd-mm-yyyy"
  };
  source: LocalDataSource = new LocalDataSource();
  sourceChild: LocalDataSource = new LocalDataSource();
  user: any;
  approved: boolean = true;
  print: boolean = true;
  tabledata: any[] = [];
  tabledataFull: any[] = [];
  dateAssignment: any = null;
  dateAssignment2: any = null;
  subscription: any;
  activeModal: any;
  selected: any = {};
  childArr: any[] = [];

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: false
    },
    edit: {
      editButtonContent: '<i class="ion-search"></i>',
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
    hideSubHeader: true,
    actions: {
      add: true,
      edit: true,
      delete: false,
      position: "right",
      columnTitle: "Detail",
      width: "10%"
    },
    pager: {
      display: true,
      perPage: 30
    },
    columns: {
      KD_ORDER: {
        title: "Kode Order",
        type: "number",
        filter: false,
        editable: false,
        width: "10%"
      },
      USER_ID: {
        title: "User ID",
        type: "string",
        filter: true,
        editable: false,
        width: "30%"
      },
      STATUS_ORDER: {
        title: "Status Order",
        type: "string",
        filter: true,
        editable: false,
        width: "30%"
      },
      DATE_ORDER: {
        title: "Tanggal Order",
        type: "string",
        filter: true,
        editable: false,
        width: "30%",
        valuePrepareFunction: date => {
          return moment(date).format("DD-MM-YYYY");
        }
      },
      TOTAL_ITEM: {
        title: "Total Item",
        type: "number",
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
    yearPeriode: moment().format("YYYY"),
    team: ""
  };
  barang: any[] = [];
  merk: any[] = [];
  order: any[] = [];
  team: any[] = [];
  orderDt: any[] = [];
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
    this.getUsers();
  }

  getUsers() {
    this.service
      .getreq("mst_users")
      .toPromise()
      .then(response => {
        if (response != null) {
          response = response.sort();
          for (let i in response) {
            if (response[i].TEAM != "admin") {
              this.team[i] =
                response[i].TEAM +
                " " +
                response[i].ID_USER +
                " " +
                response[i].USER_NAME;
            }
          }
        }
      })
      .then(() => {
        this.getOrder();
      });
  }

  refreshData() {
    // console.log(this.formData);
    // console.log(this.dateAssignment);
    // if (
    //   this.dateAssignment2 == null &&
    //   this.dateAssignment != null &&
    //   this.formData.team == ""
    // ) {
    //   this.source.setFilter([
    //     {
    //       field: "DATE_ORDER",
    //       search: moment().format("DD-MM-YYYY"),
    //       filter: (cell?: any, search?: string) => {
    //         return (
    //           moment(cell).format("DD-MM-YYYY") ==
    //           moment(this.dateAssignment.jsdate).format("DD-MM-YYYY")
    //         );
    //       }
    //     }
    //   ]);
    // } else if (
    //   this.dateAssignment2 == null &&
    //   this.dateAssignment == null &&
    //   this.formData.team != ""
    // ) {
    //   this.source.setFilter([
    //     {
    //       field: "USER_ID",
    //       search: this.findName(this.formData.team)
    //     }
    //   ]);
    // } else if (
    //   this.dateAssignment2 != null &&
    //   this.dateAssignment != null &&
    //   this.formData.team != ""
    // ) {
    //   this.source.setFilter([
    //     {
    //       field: "DATE_ORDER",
    //       search: moment().format("DD-MM-YYYY"),
    //       filter: (cell?: any, search?: string) => {
    //         return moment(cell, "DD-MM-YYYY").isBetween(
    //           moment(this.dateAssignment.jsdate, "DD-MM-YYYY"),
    //           moment(this.dateAssignment2.jsdate, "DD-MM-YYYY")
    //         );
    //       }
    //     },
    //     {
    //       field: "USER_ID",
    //       search: this.findName(this.formData.team)
    //     }
    //   ]);
    // } else if (
    //   this.dateAssignment2 != null &&
    //   this.dateAssignment != null &&
    //   this.formData.team == ""
    // ) {
    //   console.log("masuk sini");
    //   this.source.setFilter([
    //     {
    //       field: "DATE_ORDER",
    //       search: moment(this.dateAssignment.jsdate, "DD-MM-YYYY"),
    //       filter: function(cell?: any, search?: string): boolean {
    //         console.log(
    //           moment(cell, "DD-MM-YYYY").isBetween(
    //             moment(this.dateAssignment.jsdate, "DD-MM-YYYY"),
    //             moment(this.dateAssignment2.jsdate, "DD-MM-YYYY")
    //           )
    //         );
    //         return moment(cell, "DD-MM-YYYY").isBetween(
    //           moment(this.dateAssignment.jsdate, "DD-MM-YYYY"),
    //           moment(this.dateAssignment2.jsdate, "DD-MM-YYYY")
    //         );
    //       }
    //     }
    //   ]);
    // }

    console.log(this.findName(this.formData.team));

    if (
      this.dateAssignment2 == null &&
      this.dateAssignment != null &&
      this.formData.team == ""
    ) {
      this.tabledata = this.tabledataFull.filter(item => {
        return (
          item.USER_ID == this.findName(this.formData.team) &&
          item.DATE_ORDER ==
            moment(this.dateAssignment.jsdate).format("DD-MM-YYYY")
        );
      });
      this.source.load(this.tabledata);
    } else if (
      this.dateAssignment2 == null &&
      this.dateAssignment == null &&
      this.formData.team != ""
    ) {
      this.tabledata = this.tabledataFull.filter(item => {
        return item.USER_ID == this.findName(this.formData.team);
      });
      this.source.load(this.tabledata);
    } else if (
      this.dateAssignment2 != null &&
      this.dateAssignment != null &&
      this.formData.team != ""
    ) {
      this.tabledata = this.tabledataFull.filter(item => {
        return (
          item.USER_ID == this.findName(this.formData.team) &&
          moment(item.DATE_ORDER).isBetween(
            moment(this.dateAssignment.jsdate, "DD-MM-YYYY"),
            moment(this.dateAssignment2.jsdate, "DD-MM-YYYY")
          )
        );
      });
      this.source.load(this.tabledata);
    } else if (
      this.dateAssignment2 != null &&
      this.dateAssignment != null &&
      this.formData.team == ""
    ) {
      this.tabledata = this.tabledataFull.filter(item => {
        return moment(item.DATE_ORDER).isBetween(
          moment(this.dateAssignment.jsdate, "DD-MM-YYYY"),
          moment(this.dateAssignment2.jsdate, "DD-MM-YYYY")
        );
      });

      this.source.empty();
      this.source.load(this.tabledata);
    }
    console.log(this.tabledata);
  }
  getOrder() {
    this.service
      .getreq("t_order_hds")
      .toPromise()
      .then(response => {
        if (response != null) {
          this.order = response;
        }
      })
      .then(() => {
        this.service
          .getreq("t_order_dts")
          .toPromise()
          .then(response => {
            if (response != null) {
              this.orderDt = response;
              this.order.forEach((element, ind) => {
                let arr = response.filter(item => {
                  return element.KD_ORDER == item.KD_ORDER;
                });
                console.log(arr);
                if (arr != null) {
                  element.TOTAL_ITEM = arr.length;
                }
              });

              this.tabledata = this.order;
              this.tabledataFull = this.order;
              this.source.load(this.tabledata);
              this.refreshData();
            }
          });
      });
  }

  getBarang() {
    this.service
      .getreq("m_barangs")
      .toPromise()
      .then(response => {
        if (response != null) {
          this.barang = response;
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
    let arr = this.orderDt.filter(item => {
      return item.KD_ORDER == event.data.KD_ORDER;
    });

    if (arr != null) {
      arr.forEach(element => {
        let arrBarang = this.barang.filter(item => {
          return item.KD_BARANG == element.KD_BARANG;
        });
        if (arrBarang != null) {
          element.NM_BARANG = arrBarang[0].NM_BARANG;
        }
        let arrMerk = this.merk.filter(item => {
          return item.KD_MERK == element.KD_MERK;
        });
        if (arrMerk != null) {
          element.NM_MERK = arrMerk[0].NM_MERK;
        }
      });
      this.activeModal = this.modalService.open(ReportAtkModalComponent, {
        windowClass: "xlModal",
        container: "nb-layout",
        backdrop: "static"
      });
      this.activeModal.componentInstance.dataSource = arr;
    } else {
      this.toastr.error("Data does not exist!");
    }
  }

  generateChild(event) {
    let arr = this.orderDt.filter(item => {
      return item.KD_ORDER == event.data.KD_ORDER;
    });

    if (arr != null) {
      arr.forEach(element => {
        let arrBarang = this.barang.filter(item => {
          return item.KD_BARANG == element.KD_BARANG;
        });
        if (arrBarang != null) {
          element.NM_BARANG = arrBarang[0].NM_BARANG;
        }
        let arrMerk = this.merk.filter(item => {
          return item.KD_MERK == element.KD_MERK;
        });
        if (arrMerk != null) {
          element.NM_MERK = arrMerk[0].NM_MERK;
        }
      });
      this.childArr = arr;
    }
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

  changeApproveprint(event) {
    console.log("woi");
    console.log(this.selected);
    this.selected = event.data;
    this.generateChild(event);
    if (event.data.STATUS_ORDER != "APPROVED") {
      console.log("masuksini");
      this.print = true;
      this.approved = false;
    } else {
      this.print = false;
      this.approved = true;
    }
  }

  onInputFieldChanged(event: IMyInputFieldChanged) {
    this.refreshData();
  }

  approve() {
    console.log(JSON.stringify(this.selected));
    if (JSON.stringify(this.selected) === "{}") {
      this.toastr.error("No Data Selected");
    } else {
      this.tabledata.forEach(element => {
        if (element.KD_ORDER == this.selected.KD_ORDER) {
          element.STATUS_ORDER = "APPROVED";
        }
      });
      this.selected.STATUS_ORDER = "APPROVED";
      let data = this.selected;
      console.log(data);
      this.service.patchreq("t_order_hds", data).subscribe(
        response => {
          console.log(response);
          this.source.refresh();
          this.toastr.success("Data Updated!");
        },
        error => {
          //console.log("indicator detail");
          console.log(error);
          this.toastr.error("Data Error!");
        }
      );
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
      USER_TRANSACTION: this.user.USER_NAME,
      DATE_TIME_TRANSACTION: moment().format()
    };
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

  findName(team) {
    let result = "";
    let safeI = 0;
    for (var i = 0; i < team.length; i++) {
      if (team.charAt(i) == " " && safeI > 0) {
        break;
      }
      if (team.charAt(i) == " " && safeI == 0) {
        safeI = i;
      }

      if (i > safeI && safeI != 0) {
        result = result + team.charAt(i);
      }
      console.log(result);
      console.log(safeI);
    }
    return result;
  }

  printPdf() {
    this.activeModal = this.modalService.open(ReportAtkModalComponent, {
      windowClass: "xlModal",
      container: "nb-layout",
      backdrop: "static"
    });
    this.activeModal.componentInstance.dataParent = this.selected;
    this.activeModal.componentInstance.print = true;
    this.activeModal.componentInstance.dataSource = this.childArr;
    console.log(this.childArr);
  }
}
