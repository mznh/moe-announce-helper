import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { ControllerService } from '../controller.service';
import { MessageData } from '../model/message-data';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  @ViewChild('messages') messages:any;
  public messageDataList:MessageData[] =[];

  constructor(private controllerService:ControllerService) {
    this.messageDataList = this.controllerService.messageList;

  }

  ngOnInit(): void {
  }

  ngOnChanges():void{
    this.updateMessages();
  }
  public addMessage(){
    this.controllerService.addMessage("hoge","");

  }
  public updateMessages(){
    this.messageDataList = this.controllerService.messageList;
  }
  public messageChange(changeData:MessageData){
    this.controllerService.changeMessage(changeData)
    this.updateMessages();
  }

}
