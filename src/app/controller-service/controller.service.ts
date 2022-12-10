import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  SaveData, ConfigData, EventData, MessageData,
  generateMessage, generateEvent,
  getNewMessageId, getNewEventId,
  generateDefaultConfig,
  generateDefaultEventConfig,
  generateDefaultSaveData
} from '../model/message-data'; 

export const localStorageKey = "Save001";

@Injectable({
  providedIn: 'root'
})
export class ControllerService {
  //一切セーブデータがないときのダミーデータ
  public saveData:SaveData = generateDefaultSaveData();
  constructor(private snackBar:MatSnackBar) { }

  public transformOldSaveData(oldableData:any){
    // saveData.config がstringのものを全てConfigData型に変更
    if( oldableData.config === "" ){
      oldableData.config = generateDefaultConfig();
    }
    oldableData.events = oldableData.events.map((event:any) => {
      if('config' in event){
        return event;
      }else{
        // event has not config
        return {
          ... event,
          config:  generateDefaultEventConfig()
        }
      }
    }
    );
    
    return oldableData;
  }
  //描画の関係でダークモードについてだけ個別で取得
  public initDarkMode(){
    this.loadEventFromLocalStrage();
    return this.saveData.config.isDarkMode;
  }

  public isDarkMode(){
    return this.saveData.config.isDarkMode;
  }

  public setDarkMode(value:boolean){
    this.saveData.config.isDarkMode = value;
    this.saveEvent(true);
  }

  public fetchEvent(eventId:number){
    const event = this.saveData.events.find((evt)=>{return evt.id == eventId})
    if(event === undefined){
      throw 'Error: EventId is not found';
    }
    return event;
  }

  public fetchEventIndex(eventId:number){
    const eventIndex = this.saveData.events.findIndex((evt)=>{return evt.id == eventId});
    if(eventIndex === -1){
      throw 'Error: EventId is not found';
    }
    return eventIndex;
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
    const eventIndex = this.fetchEventIndex(eventId);
    if(eventIndex != -1){
      this.saveData.events.splice(eventIndex,1)
    }
  }

  public setLockEvent(eventId:number,mode:boolean){
    const event = this.fetchEvent(eventId)
    if(event != undefined){
      event.config.isLocked = mode;
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
    const oldEvent = this.fetchEvent(eventId)
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

  public changeEventLock(eventId:number, newLockStatus:boolean){
    //参照をゲッチュ
    const eventData = this.fetchEvent(eventId);
    if(eventData === undefined){
      throw 'Error: EventId is not found';
      return ;
    }
    eventData.config.isLocked = newLockStatus;

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

    this.saveData = this.transformOldSaveData(JSON.parse(saveRowStringData))
    this.toastOpen("アナウンスデータをロードしました。")
  }

  public loadEventFromJsonFile(targetFile:File, isEvent:boolean = false){
    try{
      const reader = new FileReader();
      reader.readAsText(targetFile);

      return new Promise((resolve, reject) => {
        reader.onload = () => {
          // 本来ならここでバリデーションをはさみたい
          if(typeof reader.result === 'string'){
            if(isEvent){
              const newEventIndex = getNewEventId(this.saveData)
              const newEventData = JSON.parse(reader.result)
              newEventData.id = newEventIndex;
              this.saveData.events.push(newEventData)
              localStorage.setItem(localStorageKey,this.generateJsonString())
              this.toastOpen("イベントをファイルからロードしました。")

            }else{ //全部インポートの場合
              const loadRawData = JSON.parse(reader.result)
              this.saveData = this.transformOldSaveData(loadRawData)
              localStorage.setItem(localStorageKey,this.generateJsonString())
              this.toastOpen("アナウンスデータをファイルからロードしました。")
            }
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

  public generateJsonString(eventId?:number){
    if(eventId !== undefined){
      const event = this.fetchEvent(eventId);
      if(event){
        return JSON.stringify(event);
      }
      throw new Error("Event Not Found Error")
    }
    return JSON.stringify(this.saveData);
  }

}
