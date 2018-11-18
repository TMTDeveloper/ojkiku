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
  selector: "ngx-indicator-assignment",
  templateUrl: "./assignment.barang.component.html"
})
export class AssignmentBarangComponent {
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
    kategori: ""
  };

  dateAssignment: any;

  team: any[] = [];
  users: any[] = [];
  barang: any[] = [];
  merk: any[] = [];
  assignments: any[] = [];
  barangFiltered: any[] = [];

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
      .getreq("t_assignments")
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

  refreshOption() {
    this.barangFiltered = this.barang.filter(item => {
      return this.formData.kategori == "1"
        ? item.TYPE == "1" || item.NM_BARANG == ""
        : item.TYPE == "2" || item.NM_BARANG == "";
    });
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

  updateData() {
    this.service
      .getreq("t_assignments")
      .toPromise()
      .then(response => {
        if (response != null) {
          this.assignments = response;
        }
      })
      .then(() => {
        let data = {
          KD_ASSIGN: this.generateCode(),
          KD_BARANG: this.formData.barang,
          KD_MERK: this.formData.merk,
          SERIAL_NUMBER: this.formData.serialNumber,
          QTY: this.formData.qty,
          STATUS: this.formData.status.toUpperCase(),
          TEAM_ID: this.findTeam(this.formData.team),
          USER_ID: this.findName(this.formData.team),
          DEPARTMENT: this.formData.department,
          TANGGAL_ASSIGN: this.dateAssignment.jsdate,
          DATE_ASSIGN: moment().format(),
          USER_TRANSACTION: this.user.ID_USER,
          DATE_TIME_TRANSACTION: moment().format(),
          TYPE_ASSIGN: "ASSIGN"
        };
        console.log(this.dateAssignment);
        console.log(data);
        console.log(this.assignments);
        this.service.postreq("t_assignments", data).subscribe(
          response => {
            this.toastr.success("Data Saved!");
          },
          error => {
            this.toastr.error("Data Error!");
            console.log(error);
          }
        );
      });
  }

  generateCode() {
    let counter = this.assignments.length + 1;
    if (counter < 10) {
      return "AS00" + counter.toString();
    } else if (counter < 100) {
      return "AS0" + counter.toString();
    } else if (counter < 1000) {
      return "AS" + counter.toString();
    }
  }

  findTeam(team) {
    let result = "";
    for (var i = 0; i < team.length; i++) {
      if (team.charAt(i) == " ") {
        break;
      }
      result = result + team.charAt(i);
    }
    return result;
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
}
