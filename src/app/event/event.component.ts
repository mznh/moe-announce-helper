import { Component, OnInit, OnChanges, Input, Output, ViewChild, EventEmitter} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { ControllerService } from '../controller-service/controller.service';
import { MessageComponent } from '../message/message.component';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { SaveData, EventData, MessageData } from '../model/message-data';


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  @ViewChild('messages') messages:any;
  @ViewChild('eventNameInput') nameInputElm:any;
  @ViewChild('jsonDownload') jsonDownloadLink:any;
  @ViewChild('fileInput') fileInputLink:any;
  @Input() inputEventData:EventData;
  @Output() eventChangeEvent = new EventEmitter<{event:EventData,message:MessageData}>();

  constructor(private matDialog: MatDialog, private controllerService:ControllerService) {
  }

  ngOnInit(): void {
  }

  renameEvent(){
    const newName = this.nameInputElm.nativeElement.value;
    this.eventChangeEvent.emit({
      event: this.inputEventData,
      message: { id:-1, msgType:"rename",text:newName }
    });
  }

  openDeleteModal(){
    const dialogConfig = new MatDialogConfig();

    // 表示するdialogの設定
    dialogConfig.disableClose = false;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "150px";
    dialogConfig.width = "320px";
    dialogConfig.data = {eventId: this.inputEventData.id, eventName: this.inputEventData.name};

    const modalDialog = this.matDialog.open(DeleteModalComponent, dialogConfig);

  }

  public deleteEvent(){
    const newName = this.nameInputElm.nativeElement.value;
    this.eventChangeEvent.emit({
      event: this.inputEventData,
      message: { id:-1, msgType:"delete",text:newName }
    });
  }

  public addMessage(){
    this.eventChangeEvent.emit({
      event: this.inputEventData,
      message: { id:-1, msgType:"add",text:"" }
    });

  }

  public messageChange(changeData:MessageData){
    this.eventChangeEvent.emit({
      event: this.inputEventData,
      message: changeData
    });
  }

  public drop(event: CdkDragDrop<MessageData[]>){
    moveItemInArray(this.inputEventData.messages, event.previousIndex, event.currentIndex);
    this.eventChangeEvent.emit({
      event: this.inputEventData,
      message: { id:-1, msgType:"drag",text:"" }
    });
  }

  public exportJson(){
    const fileName = "announce-helper-" + this.inputEventData.name + ".json"
    const jsonData = this.controllerService.generateJsonString(this.inputEventData.id);
    const blob = new Blob([jsonData],{type: 'application\/json'});
    const url = URL.createObjectURL(blob);
    const link: HTMLAnchorElement = this.jsonDownloadLink.nativeElement;
    link.href = url;
    link.download = fileName;
    link.click();
  }

  importJson(){
    this.fileInputLink.nativeElement.click();
  }

  onChangeFileInput(){
    try{
      const files: { [key: string]: File } = this.fileInputLink.nativeElement.files;
      const targetFile = files[0];
      this.controllerService.loadEventFromJsonFile(targetFile,true).then(()=>{
        console.log( this.controllerService.saveData)

        //変更を通知しておく
        //this.eventChangeEvent.emit({
        //  event: this.inputEventData,
        //  message: { id:-1, msgType:"drag",text:"" }
        //});
      });
    }catch(err:any){
      //めんどいんでエラーは握りつぶします
      console.log(err);
    }
  }

}
