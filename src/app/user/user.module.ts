import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { FormsModule,ReactiveFormsModule} from '@angular/forms'
import {RouterModule,Router} from '@angular/router'
import { ChatBoxComponent } from '../chat/chat-box/chat-box.component';


@NgModule({
  declarations: [LoginComponent, SignUpComponent],
 
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild ([
      {path:"sign-up",component:SignUpComponent},
      {path:"login",component:LoginComponent}
    ])
  ]
})
export class UserModule { }
