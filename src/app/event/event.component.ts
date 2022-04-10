import { Component, OnInit, OnChanges, Input, Output, ViewChild, EventEmitter} from '@angular/core';
import { MessageComponent } from '../message/message.component';
//import { ControllerService } from '../controller.service';
import { SaveData, EventData, MessageData } from '../model/message-data';

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

  constructor() {
  }

  ngOnInit(): void {
  }

  public renameEvent(){
    console.log("events-name-change")
    const newName = this.nameInputElm.nativeElement.value;
    this.eventChangeEvent.emit({
      event: this.inputEventData,
      message: { id:-1, msgType:"rename",text:newName }
    });
  }

  public deleteEvent(){
    console.log("events-name-change")
    const newName = this.nameInputElm.nativeElement.value;
    this.eventChangeEvent.emit({
      event: this.inputEventData,
      message: { id:-1, msgType:"delete",text:newName }
    });
  }

  public addMessage(){
    console.log("events-add-messages")
    this.eventChangeEvent.emit({
      event: this.inputEventData,
      message: { id:-1, msgType:"add",text:"" }
    });

  }

  public messageChange(changeData:MessageData){
    console.log("events-MessagesChange")
    this.eventChangeEvent.emit({
      event: this.inputEventData,
      message: changeData
    });
  }

}
