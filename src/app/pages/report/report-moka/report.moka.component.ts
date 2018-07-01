import { Component } from "@angular/core";
import * as moment from "moment";
import { LocalDataSource } from "ng2-smart-table";
import { BackendService } from "../../../@core/data/backend.service";

@Component({
  selector: "ngx-report-moka",
  templateUrl: "./report.moka.component.html"
})
export class ReportMokaComponent {
  disableInput: boolean;
  settings = {
    sort: true,
    hideSubHeader: true,
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    pager: {
      display: false,
      perPage: 30
    },
    columns: {
      YEAR: {
        title: "Year",
        type: "string",
        filter: false
      },
      DESCRIPTION: {
        title: "Description",
        type: "string",
        filter: false
      },
      PERCENTAGE: {
        title: "Target",
        type: "number",
        filter: false
      },
      TW1: {
        title: "TW 1",
        type: "string",
        filter: false
      },
      TW2: {
        title: "TW 2",
        type: "string",
        filter: false
      },
      TW3: {
        title: "TW 3",
        type: "string",
        filter: false
      },
      TW4: {
        title: "TW 4",
        type: "string",
        filter: false
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();
  constructor(public service: BackendService) {
    this.loadData();
  }

  loadData() {
    console.log("why tho")
    this.service.getreq("reports").subscribe(
      response => {
        const data = response;

        console.log(JSON.stringify(data));
        this.source.load(data);
      },
      error => {
        console.log(error);
      }
    );
  }

  searchRange(beginDate, endDate) {
    if (!(!beginDate && !endDate)) {
      this.source
        .setFilter(
          [
            {
              field: "dateTimeCreate",
              search: "endDate",
              filter: (value: string, endValue: string) => {
                return new Date(value) >= new Date(endValue);
              }
            }
          ],
          true
        )
        .setFilter([
          {
            field: "dateTimeCreate",
            search: "beginDate",
            filter: (value: string, beginValue: string) => {
              return new Date(value) >= new Date(beginValue);
            }
          }
        ]);
    } else {
      return this.source;
    }
  }
}
