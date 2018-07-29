
import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import * as moment from "moment";
import {NgbDateAdapter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  template: `
    <input class="form-control"  ngbDatepicker (dateSelect)="onDateSelect($event)" (click)="d.toggle()" [(ngModel)]="this.date" #d="ngbDatepicker">
  `,
})
export class MokaRealisasiDatePicker implements OnInit {

  public date;

  @Input() value;

  constructor() {  }

  ngOnInit() {
    this.date = moment(this.value).format("DD/MM/YYYY");
    console.log(this.value)
    console.log(this.date)
  }

  onDateSelect(){
    console.log('woi1')
  }

  submit(){
    console.log('woi')
  }

}