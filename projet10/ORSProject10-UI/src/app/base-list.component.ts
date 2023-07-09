import { OnInit } from '@angular/core';
import { ServiceLocatorService } from './service-locator.service';
import { HttpServiceService } from './http-service.service';
import { ActivatedRoute } from '@angular/router';
import { BaseCtl } from './base.component';

export class BaseListCtl extends BaseCtl {

  constructor(public endpoint, public locator: ServiceLocatorService, public route: ActivatedRoute) {
    super(endpoint, locator, route);
  }

  /**
   * Initialize component
   */
  ngOnInit() {
    console.log('base-list.component..ts ngoninit');
    this.preload();
    this.search();
  }

  display() {
    console.log('base-list.component..display()');
    this.search();
  }

  submit() {
    console.log('base-list.component..ts submit()');
    this.search();
  }

  delete(id){
    console.log('base list delete ng');
    super.delete(id,function(){
      console.log('base-list.component..ts delete()');
      this.search();
    });
  }


  next() {
    console.log('base-list.component..ts next');
    this.form.pageNo++;
    this.display();
  }

  previous() {
    console.log('base-list.component..ts previous');
    if (this.form.pageNo > 0) {
      this.form.pageNo--
      this.display();
    }
  }


}
