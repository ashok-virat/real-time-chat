import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import {RouterModule,Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ShareModule } from '../share/share.module';
import { RemoveSpecialCharPipe } from '../share/remove-special-char.pipe';
import { ChatRouteGuardService } from './chat-route-guard.service';



@NgModule({
  declarations: [ChatBoxComponent,RemoveSpecialCharPipe],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ShareModule,
    RouterModule.forChild ([
      {path:"chatbox",component:ChatBoxComponent,canActivate:[ChatRouteGuardService]}
    ])
  ],
  providers:[]
})
export class ChatModule { }
