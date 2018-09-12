import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";
import { IMyDpOptions } from "mydatepicker";

@Component({
  selector: "ngx-indicator-belibarang",
  templateUrl: "./beli.barang.component.html"
})
export class BeliBarangComponent {
  @ViewChild("myForm")
  private myForm: NgForm;

  source: LocalDataSource = new LocalDataSource();
  user: any;

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: "dd-mm-yyyy"
  };

  tabledata: any[] = [];

  subscription: any;
  activeModal: any;

  formData = {
    barang: "",
    merk: "",
    serialNumber: "",
    team: "",
    name: "",
    department: "",
    status: "",
    peruntukkan: true,
    keterangan: "",
    qty: 0,
    harga: 0
  };

  dateAssignment: any;

  team: any[] = [];
  users: any[] = [];
  barang: any[] = [];
  merk: any[] = [];
  assignments: any[] = [];

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    public service: BackendService,
    private authService: NbAuthService
  ) {
    this.getUserInfo();
    this.getUserBank();
    this.getBarang();
    this.getMerk();
    this.getUsers();
    this.getAssignment();
  }
  getAssignment() {
    this.service
      .getreq("t_beli_barangs")
      .toPromise()
      .then(response => {
        if (response != null) {
          this.assignments = response;
        }
      });
  }
  getUserBank() {
    if (this.user.ID_USER != "admin") {
      this.service
        .getreq("mst_user_banks")
        .toPromise()
        .then(response => {
          if (response != null) {
            let arr = response.filter(item => {
              return item.ID_USER == this.user.ID_USER;
            });
            if (arr[0] != null) {
              this.user.type = arr[0].ID_BANK;
              console.log(this.user);
            }
          }
        });
    } else {
      this.user.type = "admin";
    }
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

  updateData() {
    let data = {
      KD_BELI: this.generateCode(),
      KD_BARANG: this.formData.barang,
      KD_MERK: this.formData.merk,
      SERIAL_NUMBER: this.formData.serialNumber,
      QTY_BELI: this.formData.qty,
      STATUS: this.formData.status.toUpperCase(),
      TANGGAL_BELI: this.dateAssignment.jsdate,
      HARGA_UNIT: this.formData.harga,
      USER_TRANSACTION: this.user.USER_NAME,
      DATE_TIME_TRANSACTION: moment().format()
    };
    console.log(this.dateAssignment);
    console.log(data);
    console.log(this.assignments);
    this.service.postreq("t_beli_barangs", data).subscribe(
      response => {
        this.toastr.success("Data Saved!");
      },
      error => {
        this.toastr.error("Data Error!");
        console.log(error);
      }
    );


  }

  generateCode() {
    let counter = this.assignments.length + 1;
    if (counter < 10) {
      return "KD00" + counter.toString();
    } else if (counter < 100) {
      return "KD0" + counter.toString();
    } else if (counter < 1000) {
      return "KD" + counter.toString();
    }
  }


}
