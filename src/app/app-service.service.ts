import { Injectable } from '@angular/core';

import {Cookie} from "ng2-cookies/ng2-cookies";
import {HttpClient,HttpHeaders} from "@angular/common/http";

import {HttpErrorResponse,HttpParams} from "@angular/common/http"

import {Observable, observable} from "rxjs";
import {map,tap,catchError,finalize} from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  constructor(public http:HttpClient) { } //end constructor


  public baseUrl="https://chatapi.edwisor.com";

  public getUserInfoFromLocalstorage=()=>{
    return JSON.parse(localStorage.getItem('userInfo'))
  } //end  getUserInfoFromLocalstorage
  
  public setUserInfoInLocalstorage=(data)=>{
    localStorage.setItem('userInfo',JSON.stringify(data))
  }

  public signupFunction(data):any{
  const params=new HttpParams()
  .set('firstName',data.firstName)
  .set('lastName',data.lastName)
  .set('mobile',data.mobile)
  .set('email',data.email)
  .set('password',data.password)
  .set('apiKey',data.apiKey);
  console.log(params)
  return this.http.post(`${this.baseUrl}/api/v1/users/signup`,params)
}   //end of signup function
public signInFunction=(data):any=>{
  const params=new HttpParams()
  .set('email',data.email)
  .set('password',data.password)
  return this.http.post(`${this.baseUrl}/api/v1/users/login`,params)
}
public logout=(userId,authToken):Observable<any>=>{
  const params=new HttpParams()
  .set('userId',userId)
  .set('authToken',authToken)
  let logout=this.http.post(`${this.baseUrl}/api/v1/users/logout`,params)
  return logout;
}
}
