import { Component, OnInit } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { BackendService } from "../../../@core/data/backend.service";
import { isNullOrUndefined } from "util";
import { MokaTargetModalComponent } from "./modal/moka.target.modal.component";
import { NbAuthJWTToken, NbAuthService } from "@nebular/auth";
import { Chart } from 'chart.js';


@Component({
  selector: "ngx-moka-chart",
  templateUrl: "./moka.chart.component.html",
  styles: [`
  input:disabled {
    background-color: rgba(211,211,211, 0.6);
 }`]
})

export class MokaChartComponent implements OnInit {

  chart = [];

  source: LocalDataSource = new LocalDataSource();

  tabledata: any[] = [];

  user: any;

  subscription: any;

  formData = {
    years: moment().format("YYYY"),
    bankData: [],
    documentData: [],
    monaDataDetail: []
  };

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    public service: BackendService,
    private authService: NbAuthService
  ) {
    this.loadData();
    this.getUserInfo()
    this.getUserBank()
  }

  loadData() {
    this.service.getreq("mst_banks").subscribe(response => {
      if (response != null) {
        this.formData.bankData = response;
      }
    });
    this.service.getreq("mst_documents").subscribe(response => {
      if (response != null) {
        let documentFilter = response.filter(item => {
          return (
            item.FLAG == 'Y'
          )
        });
        if (documentFilter[0] != null){
          this.formData.documentData = documentFilter
        }
      }
    });
  }

  getUserBank() {
    if (this.user.ID_USER != "admin") {
      this.service.getreq("mst_user_banks").toPromise().then(response => {
        if (response != null) {
          let arr = response.filter(item => {
            return (
              item.ID_USER == this.user.ID_USER
            )
          });
          if (arr[0] != null) {
            this.user.type = arr[0].ID_BANK
          }

          this.formData.bankData = this.formData.bankData.filter(item => {
            return (item.ID_BANK == this.user.type)
          })
        }
      })
    } else {
      this.user.type = "admin";
    }
  }

  getUserInfo() {
    this.authService.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.user = token.getPayload(); // here we receive a payload from the token and assigne it to our `user` variable
      }
    });
  }


  ngOnInit() {
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [{
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });
  }


  save() {
    console.log("SAVE")
  }

  submit(event) {
    console.log("Submited")
  }

}
