import { Component, ViewChild } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { BackendService } from "../../@core/data/backend.service";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "ngx-realisasi",
  templateUrl: "./realisasi.component.html"
})
export class RealisasiComponent {
  data: any[];
  user: any;
  yearPeriode: string = moment().format("YYYY");
  constructor(
    public service: BackendService,
    private authService: NbAuthService,
    private toastr: ToastrService
  ) {
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.user = token.getPayload(); // here we receive a payload from the token and assigne it to our `user` variable
        this.service.getreq("M_BANKs").subscribe(response => {
          for (let data in response) {
            this.user.BANK == response[data].BANK_NO
              ? (this.user.BANK_DESCRIPTION = response[data].DESCRIPTION)
              : null;
          }
        });
        this.loadData();
      }
    });
  }

  ngOnInit() {}

  loadData() {
    let trnRealisasiPost = {
      YEAR: this.yearPeriode,
      BANK: this.user.BANK
    };
    console.log(trnRealisasiPost);
    this.service.postreq("trn_realisasi_ikus/iku", trnRealisasiPost).subscribe(
      response => {
        this.data = response.data;

        console.log(this.data);
        this.service.getreq("m_ikus").subscribe(
          response => {
            console.log(response);
            for (let item in response) {
              for (let data in this.data) {
                console.log(response[item].NO_IKU + this.data[data].NO_IKU);
                this.data[data].NO_IKU == response[item].NO_IKU
                  ? (this.data[data].IKU_NAME = response[item].DESCRIPTION)
                  : null;
              }
            }
          },
          error => {},
          () => {
            console.log(this.data);
          }
        );
      },
      error => {
        console.log(error);
      }
    );
  }

  submit(data) {
    this.service
      .postreq("trn_realisasi_ikus/postrealisasi", data)
      .subscribe(response => {
        this.toastr.success("Data Saved!");
      });
  }
}
