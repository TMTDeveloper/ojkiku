import { Component, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { BackendService } from "../../../@core/data/backend.service";
import { LocalDataSource } from "ng2-smart-table";
import { Subject } from "rxjs/Subject";
import { isNullOrUndefined } from "util";
import { Location } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "ngx-realisasi-qualitative",
  templateUrl: "./realisasi.qualitative.component.html"
})
export class RealisasiQualitativeComponent {


  private count = 1;
  yearPeriode: string = moment().format("YYYY");
  ikuIds: number[] = [1];
  @ViewChild("myForm") private myForm: NgForm;
  ikuData: any;
  detailData: any;
  activeModal: any;
  tableData: Array<any> = new Array();

  constructor(
    private modalService: NgbModal,
    public service: BackendService,
    public route: Router
  ) {
    this.loadData();
  }

  loadData() {
    this.service.getreq("M_IKUS").subscribe(response => {
      this.ikuData = response;
      console.log(JSON.stringify(this.ikuData));
      error => {
        console.log(error);
      };
    });
  }


  remove(i: number) {
    this.ikuIds.splice(i, 1);
  }

  add() {
    this.ikuIds.push(++this.count);
  }

  async register(myForm: NgForm) {
    // let a = [];
    // let lengthData = 0;

    // for (let data in this.myForm.value.iku) {
    //   if (this.myForm.value.iku[data].type !== "") {
    //     console.log(this.myForm.value.iku[data]);
    //     lengthData++;
    //     a.push(this.myForm.value.iku[data].type);

    //     let trnHdTargetPost = {
    //       YEAR: this.yearPeriode,
    //       IKU_TYPE: this.myForm.value.iku[data].type,
    //       PERCENTAGE: Number(this.myForm.value.iku[data].percentage),
    //       DATE_CREATED: moment(),
    //       DATE_MODIFIED: moment()
    //     };
    //     await this.service
    //       .postreq("trn_iku_hd_targets/posttarget", trnHdTargetPost)
    //       .subscribe(
    //         response => {
    //           console.log(JSON.stringify(response));
    //         },
    //         error => {
    //           console.log(error);
    //         }
    //       );
    //   }
    // }

    // console.log(a);
    // console.log(this.tableData);
    // let trnHdPost = {
    //   YEAR: this.yearPeriode,
    //   NO_IKU: lengthData,
    //   INPUT: 0,
    //   REV: 0,
    //   DATE_CREATED: moment(),
    //   DATE_MODIFIED: moment()
    // };
    // await this.service
    //   .postreq("trn_iku_hds/replaceorcreate", trnHdPost)
    //   .subscribe(
    //     response => {
    //       console.log(JSON.stringify(response));
    //     },
    //     error => {
    //       console.log(error);
    //     }
    //   );

    // await this.tableData.forEach((data, i) => {
    //   if (a.find(item => item === data[0].NO_IKU)) {
    //     data.forEach((item, i) => {
    //       let dataPost = {
    //         YEAR: this.yearPeriode,
    //         NO_IKU: item.NO_IKU,
    //         BANK: item.BANK_NO,
    //         TW1: Number(item.TW1),
    //         TW2: Number(item.TW2),
    //         TW3: Number(item.TW3),
    //         TW4: Number(item.TW4),
    //         DATE_CREATED: moment(),
    //         DATE_MODIFIED: moment()
    //       };

    //       console.log(dataPost);

    //       this.service.postreq("trn_iku_dts/postdt", dataPost).subscribe(
    //         response => {
    //           console.log(JSON.stringify(response));
    //         },
    //         error => {
    //           console.log(error);
    //         }
    //       );
    //     });
    //   }
    // });

    // await this.tableData.forEach((data, i) => {
    //   if (a.find(item => item === data[0].NO_IKU)) {
    //     data.forEach((item, i) => {
    //       let dataPost = {
    //         YEAR: this.yearPeriode,
    //         NO_IKU: item.NO_IKU,
    //         BANK: item.BANK_NO,
    //         TW1: 0,
    //         TW2: 0,
    //         TW3: 0,
    //         TW4: 0,
    //         DATE_CREATED: moment(),
    //         DATE_MODIFIED: moment()
    //       };

    //       console.log(dataPost);

    //       this.service.postreq("trn_realisasi_ikus/postdt", dataPost).subscribe(
    //         response => {
    //           console.log(JSON.stringify(response));
    //         },
    //         error => {
    //           console.log(error);
    //         }
    //       );
    //     });
    //   }
    // });
    // await this.route.navigateByUrl("/pages");
  }
}