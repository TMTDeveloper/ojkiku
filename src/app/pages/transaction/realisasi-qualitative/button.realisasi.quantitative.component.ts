import { Component, Input, OnInit } from '@angular/core';
import { RealisasiQualitativeModalComponent } from "./modal/realisasi.qualitative.modal.component";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  template: `
    <button type="button" class="btn btn-success" (click)="showModal()">Detail</button>
  `,
})
export class ButtonRenderComponent implements OnInit {

  public renderValue;
  activeModal: any;

  formData = {
    documentData: [
      {
        id: "rbp",
        desc: "RBP"
      },
      {
        id: "lainlain",
        desc: "Lain-lain"
      }
    ],
    bankData: [],
    monaDataDetail: []
  };


  @Input() value;

  constructor(
    private modalService: NgbModal,
  ) {  }

  ngOnInit() {
    this.renderValue = this.value;
  }

  example() {
    alert(this.renderValue);
  }

  showModal() {
    this.activeModal = this.modalService.open(
      RealisasiQualitativeModalComponent,
      {
        windowClass: "xlModal",
        container: "nb-layout",
        backdrop: "static"
      }
    );
    this.activeModal.componentInstance.formData.bankData = this.formData.bankData;
  }


}