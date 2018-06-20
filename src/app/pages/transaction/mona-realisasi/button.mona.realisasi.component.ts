
import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';


@Component({
  template: `
  <div class="input-group">
  <input class="form-control" placeholder="yyyy-mm-dd" name="d1" [(ngModel)]="formData.startDate" ngbDatepicker #d1="ngbDatepicker">
  <div class="input-group-append">
    <button class="btn btn-outline-secondary" (click)="d1.toggle()" type="button">
      <img src="assets/images/calendar-icon.svg" style="width: 1.2rem; height: 1rem; cursor: pointer;" />
    </button>
  </div>
</div>
  `,
})
export class MonaRealisasiDatePicker implements OnInit {

  public renderValue;

  @Input() value;

  constructor() {  }

  ngOnInit() {
    this.renderValue = this.value;
  }

  example() {
    alert(this.renderValue);
  }


}