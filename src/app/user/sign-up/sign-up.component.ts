import { Component, OnInit } from '@angular/core';
import { AppServiceService } from 'src/app/app-service.service';
import { Router } from '@angular/router';
import {Cookie} from "ng2-cookies/ng2-cookies";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  
})
export class SignUpComponent implements OnInit {
public firstName:any;
public lastName:any;
public mobile:any;
public email:any;
public password:any;
public apiKey:any;

  constructor(public service:AppServiceService,public router:Router,private toastr: ToastrService) {
  
  }

  ngOnInit() {
 
  }
  public goToSignin(){
    this.router.navigate(['/login'])
  }
  public signupFunction:any=()=>{
    if(!this.firstName){
      this.toastr.warning("enter the firstname")
    }
    if(!this.lastName){
      this.toastr.warning("enter the lastname")
    }
    if(!this.mobile){
      this.toastr.warning("enter the mobilenumber")
    }
    if(!this.email){
      this.toastr.warning("enter the email")
    }
    if(!this.password){
      this.toastr.warning("enter the password")
    }
    if(!this.apiKey){
      this.toastr.warning("enter the apiKey")
    }
    else{
        let data={
          firstName:this.firstName,
          lastName:this.lastName,
          mobile:this.mobile,
          email:this.email,
          password:this.password,
          apiKey:this.apiKey
        }
      console.log(data)
      this.service. signupFunction(data).subscribe(
        (apiResponse)=>{
         
          if(apiResponse.status==200){
            this.toastr.success("signup successful");
            setTimeout(()=>{
              this.goToSignin();
            },2000)
          }else{
            this.toastr.error(apiResponse.message)
          }
        },(err)=>{
          this.toastr.error("some error occured")
        }
      )
    }
  }
  public signup=(event:any)=>{
    if(event.keyCode===13){
      
      this. signupFunction()
    }
  }
}
