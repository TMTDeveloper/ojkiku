import {
  Component,
  //   ViewChild,
} from '@angular/core';
// import {
//   NgForm,
// } from '@angular/forms';
import {
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-modal',
  templateUrl: './rbb.component.html',

})
export class RbbComponent {

  modalHeader: string;
  modalContent = `Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy
      nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
      nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.`;

  constructor(private activeModal: NgbActiveModal) {}

  closeModal() {
    this.activeModal.close();
  }



  settings = {
    sort: true,
    hideSubHeader: true,
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      display: false,
      perPage: 30
    },
    columns: {
      YEAR: {
        title: 'Year',
        type: 'string',
        filter: false,
      },
      NO_IKU: {
        title: 'No Of Iku',
        type: 'number',
        filter: false,
      },
      INPUT: {
        title: 'Inputed',
        type: 'string',
        filter: false,
      },
      REV: {
        title: 'Revision',
        type: 'string',
        filter: false,
      },
      DATE_CREATED: {
        title: 'Date Created',
        type: 'date-time',
        filter: false,
      },
      DATE_MODIFIED: {
        title: 'Date Modified',
        type: 'date-time',
        filter: false,
      },
    },
  };



  // loadData(){
  //   this.service.getreq("MST_CUSTOMER_PKs/all").subscribe((response)=>{
  //     const data = response.data;
  //     this.source.load(data);
  //     (error) => {
  //       console.log(error);
  //     }
  //   })
  // }


  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
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
  selector: 'ngx-iku-header',
  templateUrl: './iku.header.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
 
    },
  
  `],
})
export class IkuHeaderComponent {
  private count = 1;
  yearPeriode: string = '2018';
  ikuIds: number[] = [1];
  //   @ViewChild('myForm')
  //   private myForm: NgForm;

  constructor(private modalService: NgbModal) {}

  showLargeModal() {
    const activeModal = this.modalService.open(RbbComponent, {
      windowClass: 'xlModal',
      container: 'nb-layout'
    });

    activeModal.componentInstance.modalHeader = 'Large Modal';
  }
  remove(i: number) {
    this.ikuIds.splice(i, 1);
  }

  add() {
    this.ikuIds.push(++this.count);
  }


}
