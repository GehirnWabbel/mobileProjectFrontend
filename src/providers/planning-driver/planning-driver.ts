import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class PlanningDriverProvider {

  private drivers = [];

  constructor(public http: HttpClient) {
    console.log('Hello PlanningDriverProvider Provider');
  }

  getDriver() {
    return this.drivers;
  }

  addDriver(driver) {
    this.drivers.push(driver);
  }

}
