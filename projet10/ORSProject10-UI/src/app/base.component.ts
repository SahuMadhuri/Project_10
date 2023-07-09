import { OnInit } from '@angular/core';
import { ServiceLocatorService } from './service-locator.service';
import { ActivatedRoute } from '@angular/router';
import { HttpServiceService } from './http-service.service';
import { formatNumber } from '@angular/common';

export class BaseCtl implements OnInit {
  
  public api = {
    endpoint: null,
    get: null,
    save: null,
    search: null,
    delete: null,
    preload: null
  }

  initApi(ep) {
    console.log(ep+" ep")
    this.api.endpoint = ep;
    this.api.get = ep + "/get";
    this.api.save = ep + "/save";
    this.api.search = ep + "/search";
    this.api.delete = ep + "/delete";
    this.api.preload = ep + "/preload";
    
    console.log("API", this.api);
  }

  /**
   * Form contains preload data, error/sucess message 
   */
  public form = {
    

    error: false, //error 
    message: null, //error or success message
    preload: [], // preload data
    data: { id: null }, //form data
    inputerror: {}, // form input error messages
    searchParams: {}, //search form
    searchMessage: null, //search result message
    list: [], // search list 
    pageNo : 0
  };

  /**
   * Initialize services 
   * 
   * @param serviceLocator 
   * @param route 
   */
  constructor(public endpoint, public serviceLocator: ServiceLocatorService, public route: ActivatedRoute) {

    var _self = this;

    _self.initApi(endpoint);

    /**
     * Get primary key from path variale
     */
    serviceLocator.getPathVariable(route, function (params) {
      _self.form.data.id = params["id"];
      console.log('I GOT ID', _self.form.data.id);
    })
  }

  /**
   * Initialize component
   */
  ngOnInit() {
    console.log("ng onint() start basecomponent.ts")
    this.preload();
    if (this.form.data.id && this.form.data.id > 0) {
      console.log("id"+ this.form.data.id);
      this.display();
    }
  }

  /**
   * Loded preload data
   */
  preload() {
    console.log(" base compnent ts preload start")
    var _self = this;
    this.serviceLocator.httpService.get(_self.api.preload, function (res) {
      if (res.success) {
        console.log("preload is succcess");
        console.log("res.result : "+res.result);
        _self.form.preload = res.result;

      } else {
        console.log("else");
        _self.form.error = true;
        _self.form.message = res.result.message;
      }
      console.log('FORM', _self.form);
    });
  }

  validate() {
    console.log("basecompnent validate")
    return this.validateForm(this.form.data);
  }

  /**
   * Override by childs 
   * 
   * @param form 
   */
  validateForm(form) {
    console.log("basecomponent.validate");
  }

  /**
   * Searhs records 
   */
  search() {
    console.log(" base component search start")
    var _self = this;
    console.log("Search Form", _self.form.searchParams);
    this.serviceLocator.httpService.post(_self.api.search + "/" + _self.form.pageNo, _self.form.searchParams, function (res) {
      
      if(res.success){
        console.log("res.success");
        _self.form.list = res.result.data;
        if(_self.form.list.length == 0){
          console.log("list ");
          _self.form.message = "No record found";
          _self.form.error = true;
        }
        console.log("List Size",_self.form.list.length );
      }else{
        console.log("else ");
        _self.form.error = false;
        _self.form.message = res.result.message;
      }
      console.log(' base component FORM', _self.form);
    });
  }

  /**
   * Contains display logic. It fetches data from database for the primary key 
   */
  display() {
    console.log('basecomponent display start');

    var _self = this;

    this.serviceLocator.httpService.get(_self.api.get + "/" + _self.form.data.id, function (res) {
      if (res.success) {
        console.log("res success 1");
        _self.populateForm(_self.form.data, res.result.data);
      } else {
        console.log("res success 1 else");
        _self.form.error = true;
        _self.form.message = res.result.message;
      }
      console.log('FORM', _self.form);
    });
  }

  /**
   * Populate HTML form data
   * Overridden by child classes.
   * 
   * @param form 
   * @param data 
   */
  populateForm(form, data) {
    console.log('basecomponent populateform  start');
    form.id = data.id;
    console.log(form.id+'formid in base ctl');
  }

  /**
   * Contains submit logic. It saves data
   */
  submit() {
    console.log('basecomponent submit  start');
    var _self = this;
    console.log(this.form+"submit running start");
    console.log(this.form.data+"form data going to be submit");
    this.serviceLocator.httpService.post(this.api.save, this.form.data, function (res) {
      _self.form.message = '';
      _self.form.inputerror = {};

      if (res.success) {
        _self.form.message = "Data is saved";
        console.log("_self.form.message");
        _self.form.data.id= res.result.data;
        
        console.log(_self.form.data.id);
        console.log("--------------------.");
        return _self.form.data.id ;
      } else {
        _self.form.error = true;
        _self.form.inputerror = res.result.inputerror;
        console.log("_self.form.inputerror"+_self.form.inputerror);
        _self.form.message = res.result.message;
      }
      _self.form.data.id= res.result.data;
      console.log('FORM', _self.form);
    });
  }

  delete(id, callback?) {
    console.log('basecomponent delete  start');
    var _self = this;
    this.serviceLocator.httpService.get(_self.api.delete + "/" + id, function (res) {
      if (res.success) {
        console.log("deleted");
        _self.form.message = "Data is deleted";
        if(callback){
          console.log('callingcallback '+ callback);
          callback();
        }
      } else {
        _self.form.error = true;
        console.log("else part");
        _self.form.message = res.result.message;
      }
    });
  }

  /**
   * Forward to page
   * @param page 
   */

  forward(page){
    console.log(page+'--->> base component page value');
    this.serviceLocator.forward(page);
  }

  
}
