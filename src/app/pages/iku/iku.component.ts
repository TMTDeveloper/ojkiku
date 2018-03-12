import { Component } from '@angular/core';

@Component({
  selector: 'ngx-iku',
  templateUrl: './iku.component.html',
})
export class IkuComponent {


  settings = {
    sort: true,
    hideSubHeader:true,
    actions:{
      add:false,
      edit:false,
      delete:false
    },
    pager:{
      display: false,
      perPage:30
    },
      columns: {
        YEAR: {
          title: 'Year',
          type: 'string',
          filter:false,
        },
        NO_IKU: {
          title: 'No Of Iku',
          type: 'number',
          filter:false,
        },
        INPUT: {
          title: 'Inputed',
          type: 'string',
          filter:false,
        },
        REV: {
          title: 'Revision',
          type: 'string',
          filter:false,
        },
        DATE_CREATED: {
          title: 'Date Created',
          type: 'date-time',
          filter:false,
        },
        DATE_MODIFIED: {
          title: 'Date Modified',
          type: 'date-time',
          filter:false,
        },
      },
    };
 
    constructor() {
    //  this.loadData();
    }
  
  
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
