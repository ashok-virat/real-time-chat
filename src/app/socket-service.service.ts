import { Injectable } from '@angular/core';

import {Cookie} from "ng2-cookies/ng2-cookies";
import {HttpClient,HttpHeaders} from "@angular/common/http";
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import io from 'socket.io-client';
import {HttpErrorResponse,HttpParams} from "@angular/common/http"

import {Observable, observable} from "rxjs";
import {map,tap,catchError,finalize} from "rxjs/operators";
import { Action } from 'rxjs/internal/scheduler/Action';


@Injectable()
export class SocketServiceService {
public baseUrl='https://chatapi.edwisor.com';
private socket;
  constructor(public http:HttpClient) {
    //connection is being created 
    //that handshake
       this.socket=io(this.baseUrl);
       
  }
  public verifyUser:any=()=>{
      let ak=Observable.create((observer)=>
      {
        this.socket.on('verifyUser',(data)=>{
          observer.next(data)
          
        }) // end socket
      }) // end observable
  
       return ak;
      } // end of verifyUser
      public setUser=(authToken)=>{
        this.socket.emit('set-user',authToken)
      }
      public onlineUserList=()=>{
        let ak=Observable.create((observer)=>{
          this.socket.on('online-user-list',(userList)=>{
            observer.next(userList)
          })// end socket
        })//end observable
        
        return ak;
      }//end onlineuserlist
      public disconnectedSocket=()=>{
        let ak=Observable.create((observer)=>{
          this.socket.on("disconnect",()=>{
            observer.next();
          })//end socket
        })//end obervable
        return ak;
      }//end disconnect
     
      public sendChatMessage=(chatMsgObject)=>{
              this.socket.emit('chat-msg',chatMsgObject)
      }
  private handleError(err:HttpErrorResponse){
    let errorMessage='';
    if(err.error instanceof Error){
      errorMessage=`${err.error.message}`
    }
    else{
      errorMessage=`${err.status}`
    }
    console.error(errorMessage)
    return Observable.throw(errorMessage)
  }
  public chatByUserId=(userId)=>{
    return Observable.create((observer)=>{
      this.socket.on(userId,(data)=>{
         observer.next(data)
      })
    })
  }//end chat by userId
 public markChatAsSeen=(userDeatils)=>{
   this.socket.emit("mark-chat-as-seen",userDeatils)
 }
 public getChat(senderId,receiverId,skip):Observable<any>{
   let currenturl=this.http.get(`${this.baseUrl}/api/v1/chat/get/for/user?senderId=${senderId}&receiverId=${receiverId}&skip=${skip}&authToken=${Cookie.get('authToken')}`)
 
    return currenturl;
  }
  public getunseenchat=(userId,authToken):Observable<any>=>{
    let chat=this.http.get(`${this.baseUrl}/api/v1/chat/unseen/user/list?userId=${userId}&authToken=${authToken}`)
  return chat;
 }
 public exitsocket=()=>{
   this.socket.disconnect()
 }
 public missingchats=(senderId,receiverId,authtoken)=>{
   let vk=this.http.get(`${this.baseUrl}/api/v1/chat/count/unseen?userId=${senderId}&senderId=${receiverId}&authToken=${authtoken}`)
   return vk;
 }
 public getunreadchat=(userId,senderId,authtoken)=>{
   let msgcount=this.http.get(`${this.baseUrl}/api/v1/chat/count/unseen?userId=${userId}&senderId=${senderId}&authToken=${authtoken}`);
   return msgcount;
 }
}
