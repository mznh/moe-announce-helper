import { Component, OnInit, OnChanges, Input, Output, ViewChild, EventEmitter} from '@angular/core';
import { MessageComponent } from '../message/message.component';
//import { ControllerService } from '../controller.service';
import { SaveData, EventData, MessageData } from '../model/message-data';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  @ViewChild('messages') messages:any;
  @ViewChild('eventNameInput') nameInputElm:any;
  @Input() inputEventData:EventData;
  @Output() eventChangeEvent = new EventEmitter<{event:EventData,message:MessageData}>();

  constructor(private matDialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  public renameEvent(){
    //console.log("events-name-change")
    const newName = this.nameInputElm.nativeElement.value;
    this.eventChangeEvent.emit({
      event: this.inputEventData,
      message: { id:-1, msgType:"rename",text:newName }
    });
  }

  public openDeleteModal(){
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

}
