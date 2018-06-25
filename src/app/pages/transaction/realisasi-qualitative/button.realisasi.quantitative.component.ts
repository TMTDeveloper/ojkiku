import { Component, Input, OnInit } from '@angular/core';
import { RealisasiQualitativeModalComponent } from "./modal/realisasi.qualitative.modal.component";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  template: `
    <button type="button" class="btn btn-success" (click)="showModal()">Detail</button>
  `,
})
export class ButtonRenderComponent implements OnInit {

  public value: ButtonRenderComponent;

  activeModal: any;

  realisasiData: any;


  constructor(
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.realisasiData = this.value;
    //console.log(this.realisasiData);
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
    this.activeModal.componentInstance.formData.ikuSelected     = this.realisasiData.KODE_IKU;
    this.activeModal.componentInstance.formData.tahunSelected   = this.realisasiData.TAHUN_REALISASI;
    this.activeModal.componentInstance.formData.periodeSelected = this.realisasiData.PERIODE;
    this.activeModal.componentInstance.formData.bankSelected    = this.realisasiData.KODE_BANK;
    this.activeModal.componentInstance.formData.noUrut          = this.realisasiData.NO;
  }


}