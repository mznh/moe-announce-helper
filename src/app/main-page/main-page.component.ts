import { Component, OnInit, AfterViewInit,ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ControllerService } from '../controller-service/controller.service';
import { EventComponent } from "../event/event.component";
import { SaveData,EventData,MessageData} from "../model/message-data";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  @ViewChild('jsonDownload') jsonDownloadLink:any;
  @ViewChild('fileInput') fileInputLink:any;

  public saveData:SaveData;

  constructor(private router:Router,private controllerService:ControllerService) {
  }

  ngOnInit(): void {
    this.updateEvents();
  }
  ngAfterViewInit() {
    // ページ開いたときに localstrage からロード
    setTimeout(()=>{this.loadLocalData()},200);
  }

  
  //多分ここがドンドンデカくなる
  eventChange(changeData:{event:EventData,message:MessageData}){
    //console.log("change-events");
    //console.log(changeData);
    const eventId = changeData.event.id;
    const newMessageData = changeData.message;
    const msgType = newMessageData.msgType;

    if(msgType === "add"){
      this.controllerService.addMessage(eventId)
    }else if(msgType === "rename"){
      this.controllerService.renameEvent(eventId,newMessageData.text)
    }else if(msgType === "delete" && newMessageData.id === -1){
      this.controllerService.deleteEvent(eventId)
    }else{
      this.controllerService.changeMessage(eventId,newMessageData);
    }
    this.controllerService.saveEvent(true);

  }


  addEvent(){
    //console.log("add-events");
    this.controllerService.addEvent();
    this.controllerService.saveEvent(true);
  }

  updateEvents(){
    this.saveData = this.controllerService.saveData;
  }

  saveLocalData(){
    //console.log("main-save")
    this.controllerService.saveEvent()
  }
  loadLocalData(){
    //console.log("main-load")
    this.controllerService.loadEventFromLocalStrage()
    this.updateEvents();
  }
  saveDataToJson(){
    const fileName = "MoE-all-announce-data.json"
    const jsonData = this.controllerService.generateJsonString()
    const blob = new Blob([jsonData],{type: 'application\/json'});
    const url = URL.createObjectURL(blob);
    const link: HTMLAnchorElement = this.jsonDownloadLink.nativeElement;
    link.href = url;
    link.download = fileName;
    link.click();
  }



  loadJsonFile(){
    this.fileInputLink.nativeElement.click();
  }

  onChangeFileInput(){
    try{
      const files: { [key: string]: File } = this.fileInputLink.nativeElement.files;
      const targetFile = files[0];
      this.controllerService.loadEventFromJsonFile(targetFile).then(()=>{
        this.loadLocalData();

      });
    }catch(err:any){
      //めんどいんでエラーは握りつぶします
      console.log(err);
    }
  }

  public drop(event: CdkDragDrop<EventData[]>){
    // 参考: https://tech.bitbank.cc/draggable-tab-by-angular-material/
    const previousIndex = parseInt(event.previousContainer.id.replace('tab-', ''), 10);
    const currentIndex = parseInt(event.container.id.replace('tab-', ''), 10);
    console.log(previousIndex,currentIndex);
    console.log(this.saveData.events, event.previousIndex, event.currentIndex);
    this.controllerService.saveEvent(true)
    moveItemInArray(this.saveData.events, event.previousIndex, event.currentIndex);
    //this.eventChangeEvent.emit({
    //  event: this.inputEventData,
    //  message: { id:-1, msgType:"drag",text:"" }
    //});
  }

  clearData(){
    localStorage.clear()
  }

}
