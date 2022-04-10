import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SaveData, EventData, MessageData, generateMessage, generateEvent } from './model/message-data'; 

export const localStorageKey = "Save001";

@Injectable({
  providedIn: 'root'
})
export class ControllerService {
  //一切セーブデータがないときのダミーデータ
  public saveData:SaveData = {
    events: [
      {
        id: 0,
        name: "サンプルイベント",
        info: "これはサンプルイベントの説明です",
        messages: [
          {
            id:0, msgType:"hoge",
            text:"セーブされたデータを読み込んでいます... データがなかったらこのままです。"
          },
        ]
      }
    ],
    config: "",
  };

  constructor(private snackBar:MatSnackBar) { }


  public fetchEvent(eventId:number){
    const event = this.saveData.events.find((evt)=>{return evt.id == eventId})
    if(event === undefined){
      throw 'Error: EventId is not found';
      return ;
    }
    return event;
  }

  public addEvent(){
    console.log("service-add-event")
    let newEventIndex = 0;
    if(this.saveData.events.length != 0){// 空じゃないときは末尾に追加
      const lastEvent = this.saveData.events[this.saveData.events.length - 1]
      newEventIndex = lastEvent.id +1
    }
    this.saveData.events.push( generateEvent(newEventIndex,"新しいイベント") )
  }

  public renameEvent(eventId:number,newName:string){
    const event = this.fetchEvent(eventId);
    if(event != undefined){
      event.name = newName;
    }
  }
  public deleteEvent(eventId:number){
    const eventIndex = this.saveData.events.findIndex((evt)=>{return evt.id == eventId});
    if(eventIndex != -1){
      this.saveData.events.splice(eventIndex,1)
    }
  }

  public addMessage(eventId:number, mesageId?:number, msgType?:string, text?:string){
    console.log("service-addMessage")
    const tmp = this.fetchEvent(eventId);
    if(tmp === undefined){
      throw "Error";
      return;
    }
    const eventData = tmp;
    let newMessageIndex  = 0
    if(eventData.messages.length != 0){//空じゃないなら末尾に追加
      const lastMessage = eventData.messages[eventData.messages.length - 1]
      newMessageIndex = lastMessage.id + 1;
    }
    eventData.messages.push({
      id: newMessageIndex,
      msgType: msgType? msgType : "hoge",
      text: text? text : ""
    });
  }

  public changeMessage(eventId:number, newMessageData:MessageData){
    console.log("changeMessage")
    //参照をゲッチュ
    const oldEvent = this.saveData.events.find((evt)=>{return evt.id == eventId})
    if(oldEvent === undefined){
      throw 'Error: EventId is not found';
      return ;
    }
    const oldMessageList = oldEvent.messages;
    const oldMessageIndex = oldMessageList.findIndex((elm)=>{return elm.id == newMessageData.id});
    if(newMessageData.msgType === "delete"){
      oldMessageList.splice(oldMessageIndex,1)
    }else{
      oldMessageList[oldMessageIndex] = newMessageData;
    }
  }

  public saveEvent(){
    console.log("service-save")
    console.log(localStorage)
    localStorage.setItem(localStorageKey,this.generateJsonString())

    this.toastOpen("アナウンスデータをセーブしました。")
  }
  public loadEventFromLocalStrage(){
    console.log("service-load-from local strage")
    const saveRowStringData = localStorage.getItem(localStorageKey)
    console.log(localStorage)
    if(saveRowStringData === null){
      console.log("save data is null")
      return;
    }
    this.saveData = JSON.parse(saveRowStringData)
    this.toastOpen("アナウンスデータをロードしました。")
  }

  public loadEventFromJsonFile(targetFile:File){
    const reader = new FileReader();
    reader.readAsText(targetFile);
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        if(typeof reader.result === 'string'){
				  this.saveData = JSON.parse(reader.result)
          localStorage.setItem(localStorageKey,this.generateJsonString())
          this.toastOpen("アナウンスデータをファイルからロードしました。")
        }

        resolve(reader.result);

      };
      reader.onerror = () => {
        reject(reader.error);
      };
    });
  }


  // util系　あとでわけたい
  public toastOpen(msg:string){
    this.snackBar.open(msg,'Close',{
      horizontalPosition: "center",
      verticalPosition: "top",
      duration:2000
    });
  }

  public generateJsonString(){
    return JSON.stringify(this.saveData);
  }

}
