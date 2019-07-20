import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SocketServiceService } from 'src/app/socket-service.service';
import { AppServiceService } from 'src/app/app-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {chatMessage} from './chat';



@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers:[SocketServiceService]
})
export class ChatBoxComponent implements OnInit {
  @ViewChild('scrollMe',{read:Element}) 
  
  public scrollMe:ElementRef;

public name:any;
public authToken:any;
public userInfo:any;
public receiverId:any;
public receiverName:any;
public unseenchat:any;
public userList:any=[];
public disconnectedSocket:boolean;
public chat:any;
public messageText;
public messageList=[];
public scrollToChatTop:boolean=false;
public pageValue=0;
public loadingPreviousChat;
public received:any;
public userid:any;


  constructor(public socketservice:SocketServiceService,public appservice:AppServiceService,public router:Router,private toastr: ToastrService) {
    this.receiverId=Cookie.get('receiverId');
    this.receiverName=Cookie.get('receiverName');
  
   }

  ngOnInit() {
    this.authToken=Cookie.get('authToken');
   
    this.userInfo=this.appservice.getUserInfoFromLocalstorage();
    console.log(this.userInfo)
    this.received=this.userInfo.firstName;
    console.log(this.userInfo.userId)
    
    this.verifyuserconfirmation();
    this.getMessageFromUser();
    
    
  }
  public sendingmessageusingkerpress=(event:any)=>{
    if(event.keyCode===13){
      this.sendMessage();
    }
  }
  
 
  public verifyuserconfirmation=()=>{
    
    this.socketservice.verifyUser().subscribe(
      (data)=>{
       
      
        this.disconnectedSocket=false;
        this.socketservice.setUser(this.authToken)
        this.getonlineuserlist()
      }
    )
  }
  public getonlineuserlist=()=>{
      this.socketservice.onlineUserList().subscribe(
        (userList)=>{
         
          console.log(userList)
          this.userList=[];
          for (let x in userList){
          let temp={'userId':x,'name':userList[x],'unread':0,'chatting':false}
          this.userList.push(temp);
        
          }
          console.log(this.userList)
          this.getuserListofunseenchats();  
        }
        
      )
  }
 
  public sendMessage=()=>{
    if(this.messageText){
      let chatMsgObject:chatMessage={
        senderName:this.userInfo.firstName+" "+this.userInfo.lastName,
        senderId:this.userInfo.userId,
        receiverName:Cookie.get('receiverName'),
        receiverId:Cookie.get('receiverId'),
        message:this.messageText,
        createdOn:new Date()
      }
      console.log(chatMsgObject)
      this.socketservice.sendChatMessage(chatMsgObject)
      this.pushToChatWindow(chatMsgObject)
    }
  }
  public pushToChatWindow=(data)=>{
 
    this.messageText="";
    this.messageList.push(data);
    this.scrollToChatTop=false;
     }
  public getMessageFromUser=()=>{
   
    this.socketservice.chatByUserId(this.userInfo.userId).subscribe((data)=>{
    (this.receiverId==data.senderId)?this.messageList.push(data):"";
      this.toastr.success(`${data.senderName} says :${data.message}`);
      this.scrollToChatTop=false;
      console.log(data)
      console.log(this.messageList)
    })
    
  }


public userSelectedToChat(id,name){
  console.log(this.messageList)

    this.userList.map((user)=>{
      if(user.userId==id){
        user.chatting=true;
      }
      else {
        user.chatting=false;
      }
    })
    
    Cookie.set("receiverId",id)
    Cookie.set('receiverName',name)
 
  this.receiverId=id;
  this.receiverName=name;
  this.messageList=[]
 
  this.pageValue=0;

  this.scrollToChatTop=false;
  let chatDetails={
    userId:this.userInfo.userId,
    senderId:id
  }
this.socketservice.markChatAsSeen(chatDetails)
this.getpreviousChatWithUser();
}
public getpreviousChatWithUser=()=>{
 
    let previousData=(this.messageList.length>0)?this.messageList.slice():[];

    this.socketservice.getChat(this.userInfo.userId,this.receiverId,this.pageValue*10)
    .subscribe(apiResponse=>{
    
      if(apiResponse.status==200){
        this.messageList=apiResponse.data.concat(previousData)
    
        console.log(this.messageList)
      } else{
        this.messageList=previousData;
        this.toastr.warning("No message available")
      }
      this.loadingPreviousChat=false;
    },
    err=>{
      this.toastr.error("some error occured")
   }
 )
}
public loadEarlierPageOfChat() {
   
    this.loadingPreviousChat =true;
    this.pageValue++;
    this.scrollToChatTop=true;
    this.getpreviousChatWithUser();
  
}
public getuserListofunseenchats(){
  this.socketservice.getunseenchat(this.userInfo.userId,this.authToken).subscribe(
    apiResponse=>{
      console.log(apiResponse)
     this.unseenchat=apiResponse.data;
   for (let y of this.unseenchat){
           this.name=y.firstName+" "+y.lastName;
           this.userid=y.userId;
           console.log(this.userid)
   }
     for(let x of this.userList){
       console.log(x.userId)
       this.chat=x.userId;
       console.log(this.chat)
     }
    },
    err=>{
       this.toastr.error("some error occured")
    }
  )
}
public logout(){ 
  
  this.appservice.logout(this.userInfo.userId,this.authToken).subscribe(
    apiResponse=>{
      console.log(apiResponse)
      if(apiResponse.status==200){
        this.toastr.success("logout successfully")
        Cookie.delete('authToken')
        Cookie.delete('receiverId')
        Cookie.delete('receiverName')
        this.socketservice.exitsocket();
        this.router.navigate(['/login'])
      }
      else {
        this.toastr.error(apiResponse.message)
      }
      },
      err=>{
        this.toastr.error("some error occured")
      }

  )
}
public showerthename=(name:string)=>{
  this.toastr.success("you are chatting with"+" "+name)
}

}
