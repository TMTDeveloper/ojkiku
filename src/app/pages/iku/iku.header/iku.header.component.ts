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
  selector: "ngx-modal",
  templateUrl: "./rbb.component.html"
})
export class RbbComponent {
  modalHeader: string;
  modalData: any;
  source: LocalDataSource = new LocalDataSource();
  tableData: any[];
  ikuNo: any;
  resume: boolean;
  constructor(
    private activeModal: NgbActiveModal,
    public service: BackendService
  ) {
    this.loadData();
  }

  closeModal() {
    this.activeModal.close(this.tableData);
  }

  settings: any = {
    mode: "inline",
    sort: true,
    hideSubHeader: true,
    actions: {
      add: false,
      edit: true,
      delete: false
    },
    pager: {
      display: false,
      perPage: 30
    }
  };

  loadData() {
    this.service.getreq("M_BANKS").subscribe(
      response => {
        const bank = response;
        let tempTable = [];
        console.log(JSON.stringify(response));
        this.service
          .postreq("TRN_IKU_DTS/iku", {
            year: this.modalData.year,
            no_iku: this.modalData.no_iku
          })
          .subscribe(res => {
            const iku = res;
            console.log(JSON.stringify(res));

            for (let data in bank) {
              let LST_YEAR_TW3 = () => {
                for (let ikuData in iku.data) {
                  if (iku.data[ikuData].BANK == bank[data].BANK_NO) {
                    return iku.data[ikuData].TW3;
                  }
                }
              };

              let LST_YEAR_TW4 = () => {
                for (let ikuData in iku.data) {
                  if (iku.data[ikuData].BANK == bank[data].BANK_NO) {
                    return iku.data[ikuData].TW4;
                  }
                }
              };

              let tempData = {
                NO_IKU: this.ikuNo,
                NO: Number(data) + 1,
                BANK: bank[data].DESCRIPTION,
                BANK_NO: bank[data].BANK_NO,
                LST_YEAR_TW3: LST_YEAR_TW3(),
                LST_YEAR_TW4: LST_YEAR_TW4(),
                TW1: "",
                TW2: "",
                TW3: "",
                TW4: "",
                GROWTH_PERCENTAGE: 0,
                GROWTH: 0
              };

              tempTable.push(tempData);
              this.resume ? null : (this.tableData = tempTable);
            }
            this.settings = {
              mode: "inline",
              sort: true,
              hideSubHeader: true,
              actions: {
                add: false,
                edit: true,
                delete: false
              },
              pager: {
                display: false,
                perPage: 30
              },
              columns: {
                NO: {
                  title: "No",
                  type: "number",
                  filter: false,
                  editable: false
                },
                BANK: {
                  title: "Bank",
                  type: "string",
                  filter: false,
                  editable: false
                },
                LST_YEAR_TW3: {
                  title: "TW 3 " + (Number(this.modalData.year) - 1).toString(),
                  type: "number",
                  filter: false,
                  editable: false,
                  valuePrepareFunction: value => {
                    if (isNaN(value)) {
                      return 0;
                    } else {
                      return value
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                    }
                  }
                },
                LST_YEAR_TW4: {
                  title: "TW 4 " + (Number(this.modalData.year) - 1).toString(),
                  type: "number",
                  filter: false,
                  editable: false,
                  valuePrepareFunction: value => {
                    if (isNaN(value)) {
                      return 0;
                    } else {
                      return value
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                    }
                  }
                },
                TW1: {
                  title: "TW1",
                  type: "number",
                  filter: false,
                  editable: true,
                  valuePrepareFunction: value => {
                    if (isNaN(value)) {
                      return 0;
                    } else {
                      return Number(value)
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                    }
                  }
                },
                TW2: {
                  title: "TW2",
                  type: "number",
                  filter: false,
                  editable: true,
                  valuePrepareFunction: value => {
                    if (isNaN(value)) {
                      return 0;
                    } else {
                      return Number(value)
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                    }
                  }
                },
                TW3: {
                  title: "TW3",
                  type: "number",
                  filter: false,
                  editable: true,
                  valuePrepareFunction: value => {
                    if (isNaN(value)) {
                      return 0;
                    } else {
                      return Number(value)
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                    }
                  }
                },
                TW4: {
                  title: "TW4",
                  type: "number",
                  filter: false,
                  editable: true,
                  valuePrepareFunction: value => {
                    if (isNaN(value)) {
                      return 0;
                    } else {
                      return Number(value)
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                    }
                  }
                },
                GROWTH_PERCENTAGE: {
                  title: "GROWTH %",
                  type: "number",
                  filter: false,
                  editable: false,
                  valuePrepareFunction: value => {
                    if (isNaN(value)) {
                      return 0;
                    } else {
                      return value
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                    }
                  }
                },
                GROWTH: {
                  title: "GROWTH AMOUNT",
                  type: "number",
                  filter: false,
                  editable: false,
                  valuePrepareFunction: value => {
                    if (isNaN(value)) {
                      return 0;
                    } else {
                      return value
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                    }
                  }
                }
              }
            };

            this.source.load(this.tableData);
          });
      },
      error => {
        console.log(error);
      }
    );
  }

  onDeleteConfirm(event): void {
    if (window.confirm("Are you sure you want to delete?")) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  // searchRange(beginDate, endDate){
  //   if (!(!beginDate && !endDate)){
  //     this.source.setFilter([
  //    {
  //      field:'dateTimeCreate',
  //      search:'endDate',
  //      filter: (value: string, endValue: string)=>{
  //        return new Date (value) >= new Date (endValue);
  //      }
  //     }
  //   ], true).setFilter([
  //     {
  //       field:'dateTimeCreate',
  //       search:'beginDate',
  //       filter: (value: string, beginValue: string)=>{
  //         return new Date (value) >= new Date (beginValue);
  //       }
  //     }
  //   ]);
  //   } else {
  //     return this.source;
  //   }
  // }
}

@Component({
  selector: "ngx-iku-header",
  templateUrl: "./iku.header.component.html",
  styles: [
    `
    nb-card {
      transform: translate3d(0, 0, 0);
 
    },
  
  `
  ]
})
export class IkuHeaderComponent {
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

  showLargeModal(no_iku) {
    const data = {
      year: this.yearPeriode,
      no_iku: this.myForm.value.iku[no_iku].type
    };
    this.activeModal = this.modalService.open(RbbComponent, {
      windowClass: "xlModal",
      container: "nb-layout",
      backdrop: "static"
    });

    var a = {
      iku: {
        "iku[1]": {
          type: "7",
          percentage: ""
        },
        "iku[2]": {
          type: "",
          percentage: ""
        }
      }
    };

    this.tableData.forEach((data, i) => {
      if (data[0].NO_IKU == this.myForm.value.iku[no_iku].type) {
        this.activeModal.componentInstance.resume = true;
        this.activeModal.componentInstance.tableData = this.tableData[i];
      }
    });

    this.activeModal.componentInstance.modalHeader = "Large Modal";
    this.activeModal.componentInstance.modalData = data;
    this.activeModal.componentInstance.ikuNo = this.myForm.value.iku[
      no_iku
    ].type;
    this.activeModal.result.then(async response => {
      console.log("ini no" + response[0].NO_IKU);

      if (response[0].NO_IKU !== "") {
        await this.tableData.forEach((element, i) => {
          if (
            element[0].NO_IKU == response[0].NO_IKU ||
            element[0].NO_IKU == ""
          ) {
            this.tableData.splice(i, 1);
          }
        });
        await this.tableData.push(response);
      }
      console.log(JSON.stringify(this.tableData));
    });
  }
  remove(i: number) {
    this.ikuIds.splice(i, 1);
  }

  add() {
    this.ikuIds.push(++this.count);
  }

  async register(myForm: NgForm) {
    let a = [];
    let lengthData = 0;

    for (let data in this.myForm.value.iku) {
      if (this.myForm.value.iku[data].type !== "") {
        console.log(this.myForm.value.iku[data]);
        lengthData++;
        a.push(this.myForm.value.iku[data].type);

        let trnHdTargetPost = {
          YEAR: this.yearPeriode,
          IKU_TYPE: this.myForm.value.iku[data].type,
          PERCENTAGE: Number(this.myForm.value.iku[data].percentage),
          DATE_CREATED: moment(),
          DATE_MODIFIED: moment()
        };
        await this.service
          .postreq("trn_iku_hd_targets/posttarget", trnHdTargetPost)
          .subscribe(
            response => {
              console.log(JSON.stringify(response));
            },
            error => {
              console.log(error);
            }
          );
      }
    }

    console.log(a);
    console.log(this.tableData);
    let trnHdPost = {
      YEAR: this.yearPeriode,
      NO_IKU: lengthData,
      INPUT: 0,
      REV: 0,
      DATE_CREATED: moment(),
      DATE_MODIFIED: moment()
    };
    await this.service
      .postreq("trn_iku_hds/replaceorcreate", trnHdPost)
      .subscribe(
        response => {
          console.log(JSON.stringify(response));
        },
        error => {
          console.log(error);
        }
      );

    await this.tableData.forEach((data, i) => {
      if (a.find(item => item === data[0].NO_IKU)) {
        data.forEach((item, i) => {
          let dataPost = {
            YEAR: this.yearPeriode,
            NO_IKU: item.NO_IKU,
            BANK: item.BANK_NO,
            TW1: Number(item.TW1),
            TW2: Number(item.TW2),
            TW3: Number(item.TW3),
            TW4: Number(item.TW4),
            DATE_CREATED: moment(),
            DATE_MODIFIED: moment()
          };

          console.log(dataPost);

          this.service.postreq("trn_iku_dts/postdt", dataPost).subscribe(
            response => {
              console.log(JSON.stringify(response));
            },
            error => {
              console.log(error);
            }
          );
        });
      }
    });
    await this.route.navigateByUrl("../../pages/iku");
  }
}
