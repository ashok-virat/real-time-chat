
export interface chatMessage{
   chatId?:string,
   message:string,
   createdOn:Date,
   receiverId:string,
   receiverName:string,
   senderId:string,
   senderName:string
}