import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  SaveData, EventData, MessageData,
  generateMessage, generateEvent,
  getNewMessageId, getNewEventId} from '../model/message-data'; 

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
            id:0, msgType:"say",
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
    const newEventIndex = getNewEventId(this.saveData);
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
    const eventData = this.fetchEvent(eventId);
    if(eventData === undefined){
      throw "Error";
      return;
    }
    const newMessageIndex  = getNewMessageId(eventData)

    //add で追加されるデフォmessageはここ
    //外だししたほうがいいかも
    eventData.messages.push({
      id: newMessageIndex,
      msgType: msgType? msgType : "say",
      text: text? text : ""
    });
  }

  public changeMessage(eventId:number, newMessageData:MessageData){
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

  public saveEvent(quiet:boolean = false){
    localStorage.setItem(localStorageKey,this.generateJsonString())
    if(quiet === false){
      this.toastOpen("アナウンスデータをセーブしました。")
    }

  }
  public loadEventFromLocalStrage(){
    const saveRowStringData = localStorage.getItem(localStorageKey)
    if(saveRowStringData === null){
      return;
    }
    this.saveData = JSON.parse(saveRowStringData)
    this.toastOpen("アナウンスデータをロードしました。")
  }

  public loadEventFromJsonFile(targetFile:File){
    try{
      const reader = new FileReader();
      reader.readAsText(targetFile);

      return new Promise((resolve, reject) => {
        reader.onload = () => {
          // 本来ならここでバリデーションをはさみたい
          if(typeof reader.result === 'string'){
            this.saveData = JSON.parse(reader.result)
            localStorage.setItem(localStorageKey,this.generateJsonString())
            this.toastOpen("アナウンスデータをファイルからロードしました。")
          }else{
            this.toastOpen("ファイル形式が間違っています。")
            throw 'type error ';
          }

          resolve(reader.result);

        };
        reader.onerror = () => {
          this.toastOpen("ファイル形式が間違っています。")
          throw 'type error ';
          reject(reader.error);
        };
      });
    }catch(err:any){
      this.toastOpen("ファイル読み込みエラー\n形式が間違っているかも？")
      throw new Error("ファイル読み込みエラー") 
    }
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
