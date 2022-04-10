import { Output, EventEmitter, AfterViewInit,ViewChild, Component, OnInit, OnChanges, Input} from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FormBuilder } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
import { MessageData } from '../model/message-data';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @ViewChild('messageValue') messageValue:any;
  @Input() inputMessageId:number;
  @Input() inputMessageType:string;
  @Input() inputMessageText:string;
  @Output() textChangeEvent = new EventEmitter<MessageData>();

  constructor(private clipboard: Clipboard){ 
  }


  ngOnInit(): void {
  }
  ngAfterViewInit() {
    console.log(this.messageValue)
    this.messageValue.nativeElement.value = this.inputMessageText;
  }
  ngOnChanges(){
    //console.log(this.inputMessageId)
    //console.log(this.inputMessageType)
    //console.log(this.inputMessageText)
  }

  public copyToClipboard(){
    const messageText = this.messageValue.nativeElement.value;
    this.clipboard.copy(messageText)
  }

  public deleteMessage(){
    this.textChangeEvent.emit({
      id: this.inputMessageId,
      msgType: "delete",
      text: ""
    });
  }
  public nameChange(){
  }

  public textChange(){
    const messageText = this.messageValue.nativeElement.value;
    this.textChangeEvent.emit({
      id: this.inputMessageId,
      msgType: this.inputMessageType,
      text: messageText
    });
  }

}
