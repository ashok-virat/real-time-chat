import { Component, OnInit } from '@angular/core';
import {Cookie} from "ng2-cookies/ng2-cookies";
import { AppServiceService } from 'src/app/app-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public service:AppServiceService,public router:Router,private toastr: ToastrService) { }
  public email:any;
  public password:any;
  ngOnInit() {
  }
  public signinFunction=()=>{
    if(!this.email){
      this.toastr.warning("enter the email")
    }
    if(!this.password){
      this.toastr.warning("enter the password")
    }
    else {
      let data={
        email:this.email,
        password:this.password
      }
    this.service.signInFunction(data).subscribe(
      (apiResponse)=>{
        if(apiResponse.status==200) {
        
          this.toastr.success("signin successful")
          Cookie.set('authToken',apiResponse.data.authToken);
          Cookie.set('receiverId',apiResponse.data.userDetails.userId);
          Cookie.set('receiverName',apiResponse.data.userDetails.firstName)
        this.service. setUserInfoInLocalstorage(apiResponse.data.userDetails);
          setTimeout(()=>{
            this.goTochat();
          },2000)
        }
        else {
          this.toastr.error(apiResponse.message)
        }
      },
      (err)=>{
        this.toastr.error("some error occured")
      }
    )
    }
  }
  public goTochat(){
    this.router.navigate(['/chatbox'])
  }
  public signin=(event:any)=>{
  
     if(event.keyCode===13){
  
      this.signinFunction()
     }
  }
}
