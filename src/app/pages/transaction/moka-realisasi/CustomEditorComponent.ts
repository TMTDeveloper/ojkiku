import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import * as moment from "moment";
import { Cell, DefaultEditor, Editor } from "ng2-smart-table";
import { IMyDpOptions, IMyDateModel, IMyInputFieldChanged } from "mydatepicker";

@Component({
  template: `
  <my-date-picker name="mydate" [(ngModel)]="dateAssignment" [options]="myDatePickerOptions"  (inputFieldChanged)="onInputFieldChanged($event)"></my-date-picker>
  `
})
export class CustomEditorComponent extends DefaultEditor
  implements AfterViewInit {
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: "dd/mm/yyyy"
  };
  @ViewChild("name")
  name: ElementRef;
  @ViewChild("url")
  url: ElementRef;
  @ViewChild("htmlValue")
  htmlValue: ElementRef;
  public dateAssignment: any = { date: { year: 2018, month: 10, day: 9 } };
  constructor() {
    super();
  }
  onInputFieldChanged(event: IMyInputFieldChanged) {
    this.updateValue();
  }
  ngAfterViewInit() {
    if (this.cell.newValue !== "") {
      let dateInit = this.cell.getValue();
      this.dateAssignment = {
        date: {
          year: parseInt(dateInit.substring(6, 10)),
          month: parseInt(dateInit.substring(3, 5)),
          day: parseInt(dateInit.substring(0, 2))
        }
      };
    }
  }
  pad(n) {
    return ("00" + n).slice(-2);
  }
  updateValue() {
    console.log(
      this.dateAssignment.date.day +
        "/" +
        this.dateAssignment.date.month +
        "/" +
        this.dateAssignment.date.year
    );
    this.cell.newValue =
      this.pad(this.dateAssignment.date.day).toString() +
      "/" +
      this.pad(this.dateAssignment.date.month).toString() +
      "/" +
      this.dateAssignment.date.year.toString();
  }
}
