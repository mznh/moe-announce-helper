import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageData } from './model/message-data'; 

export const localStorageKey = "Save001";

@Injectable({
  providedIn: 'root'
})
export class ControllerService {
  public messageList:MessageData[] = [
    {id:0, msgType:"hoge", text:"セーブされたデータを読み込んでいます... データがなかったらこのままです。"},
  ];

  constructor(private snackBar:MatSnackBar) { }

  public gennerateJsonString(){
    console.log(this.messageList)
    return JSON.stringify(this.messageList);
  }

  public addMessage(msgType:string, text:string){
    if(this.messageList.length === 0){
      this.messageList.push({
        id: 0,
        msgType: msgType,
        text: text
      });
      return ; 
    }
    const lastMessage = this.messageList[this.messageList.length - 1]

    this.messageList.push({
      id: lastMessage.id + 1,
      msgType: msgType,
      text: text
    });
  }

  public changeMessage(newMessageData:MessageData){
    const oldMessageIndex = this.messageList.findIndex((elm)=> {return elm.id == newMessageData.id})
    if(newMessageData.msgType === "delete"){
      this.messageList.splice(oldMessageIndex,1)
      
    }else{
      this.messageList[oldMessageIndex] = newMessageData;
    }

  }
  public toastOpen(msg:string){
    this.snackBar.open(msg,'Close',{
      horizontalPosition: "center",
      verticalPosition: "top",
      duration:2000});
  }

  public saveEvent(){
    console.log("service-save")
    console.log(localStorage)
    
    this.toastOpen("アナウンスデータをセーブしました。")

    localStorage.setItem(localStorageKey,this.gennerateJsonString())
  }
  public loadEventFromLocalStrage(){
    console.log("service-load-from local strage")
    const saveData = localStorage.getItem(localStorageKey)
    if(saveData === null){
      console.log("save data is null")
      return;
    }
    this.messageList = JSON.parse(saveData)
    console.log(this.messageList);
    this.toastOpen("アナウンスデータをロードしました。")
  }
}
